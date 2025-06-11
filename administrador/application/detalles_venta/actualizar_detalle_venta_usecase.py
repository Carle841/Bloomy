from administrador.domain.detalles_venta.detalle_venta import DetalleVenta
from administrador.domain.detalles_venta.detalle_venta_repository_port import DetalleVentaRepositoryPort
from administrador.infrastructure.pg_command import PGCommand
from decimal import Decimal
from typing import Optional

class ActualizarDetalleVentaUseCase:
    def __init__(self, repo: DetalleVentaRepositoryPort, db: PGCommand):
        self.repo = repo
        self.db = db

    def execute(
        self,
        id: int,
        producto_id: Optional[int] = None,
        combo_id: Optional[int] = None,
        cantidad: Optional[int] = None
    ) -> None:
        # Obtener detalle existente
        detalle_existente = self.repo.get_by_id(id)
        if not detalle_existente:
            raise Exception("Detalle de venta no encontrado")

        # Determinar nuevo producto_id, combo_id y cantidad
        nuevo_producto_id = producto_id if producto_id is not None else detalle_existente.get_producto_id()
        nuevo_combo_id = combo_id if combo_id is not None else detalle_existente.get_combo_id()
        nueva_cantidad = cantidad if cantidad is not None else detalle_existente.get_cantidad()

        # Validar que sea producto o combo, pero no ambos
        if nuevo_producto_id is None and nuevo_combo_id is None:
            raise Exception("Debe especificarse producto_id o combo_id")
        if nuevo_producto_id is not None and nuevo_combo_id is not None:
            raise Exception("No se pueden especificar producto_id y combo_id simultáneamente")

        precio_unitario = None
        productos_a_restock = []
        productos_a_restar = []

        # Restaurar stock del detalle anterior
        if detalle_existente.get_producto_id():
            productos_a_restock.append({
                "producto_id": detalle_existente.get_producto_id(),
                "cantidad": detalle_existente.get_cantidad()
            })
        elif detalle_existente.get_combo_id():
            self.db.execute("""
                UPDATE tienda.combos
                SET stock = stock + %(cantidad)s
                WHERE id = %(combo_id)s
            """, {"cantidad": detalle_existente.get_cantidad(), "combo_id": detalle_existente.get_combo_id()})

            productos_combo = self.db.queryall("""
                SELECT producto_id, cantidad
                FROM tienda.combos_productos
                WHERE combo_id = %(combo_id)s
            """, {"combo_id": detalle_existente.get_combo_id()})

            for p in productos_combo:
                productos_a_restock.append({
                    "producto_id": p["producto_id"],
                    "cantidad": p["cantidad"] * detalle_existente.get_cantidad()
                })

        # Procesar nuevo detalle
        if nuevo_producto_id:
            # Producto individual
            fila = self.db.queryone("""
                SELECT precio, stock
                FROM tienda.productos
                WHERE id = %(producto_id)s
            """, {"producto_id": nuevo_producto_id})

            if not fila:
                raise Exception(f"Producto con ID {nuevo_producto_id} no encontrado en productos")

            precio_unitario = Decimal(str(fila["precio"]))
            stock_actual = fila["stock"]

            if stock_actual < nueva_cantidad:
                raise Exception(f"Stock insuficiente para producto ID {nuevo_producto_id}: {stock_actual} disponible, {nueva_cantidad} solicitado")

            productos_a_restar.append({"producto_id": nuevo_producto_id, "cantidad": nueva_cantidad})

        elif nuevo_combo_id:
            # Combo
            fila = self.db.queryone("""
                SELECT precio_con_descuento, stock, estado
                FROM tienda.combos
                WHERE id = %(combo_id)s
            """, {"combo_id": nuevo_combo_id})

            if not fila:
                raise Exception(f"Combo con ID {nuevo_combo_id} no encontrado")

            if fila["estado"] != "Activo":
                raise Exception(f"Combo con ID {nuevo_combo_id} no está activo")

            precio_unitario = Decimal(str(fila["precio_con_descuento"]))
            stock_combo = fila["stock"]

            if stock_combo < nueva_cantidad:
                raise Exception(f"Stock insuficiente para combo ID {nuevo_combo_id}: {stock_combo} disponible, {nueva_cantidad} solicitado")

            productos_combo = self.db.queryall("""
                SELECT producto_id, cantidad
                FROM tienda.combos_productos
                WHERE combo_id = %(combo_id)s
            """, {"combo_id": nuevo_combo_id})

            for p in productos_combo:
                stock_fila = self.db.queryone("""
                    SELECT stock
                    FROM tienda.productos
                    WHERE id = %(producto_id)s
                """, {"producto_id": p["producto_id"]})

                if not stock_fila:
                    raise Exception(f"Producto con ID {p['producto_id']} no encontrado")

                stock_producto = stock_fila["stock"]
                cantidad_requerida = p["cantidad"] * nueva_cantidad

                if stock_producto < cantidad_requerida:
                    raise Exception(f"Stock insuficiente para producto ID {p['producto_id']}: {stock_producto} disponible, {cantidad_requerida} solicitado")

                productos_a_restar.append({"producto_id": p["producto_id"], "cantidad": cantidad_requerida})

            self.db.execute("""
                UPDATE tienda.combos
                SET stock = stock - %(cantidad)s
                WHERE id = %(combo_id)s
            """, {"cantidad": nueva_cantidad, "combo_id": nuevo_combo_id})

        # Restaurar stock
        for p in productos_a_restock:
            self.db.execute("""
                UPDATE tienda.productos
                SET stock = stock + %(cantidad)s
                WHERE id = %(producto_id)s
            """, {"cantidad": p["cantidad"], "producto_id": p["producto_id"]})

        # Restar stock nuevo
        for p in productos_a_restar:
            self.db.execute("""
                UPDATE tienda.productos
                SET stock = stock - %(cantidad)s
                WHERE id = %(producto_id)s
            """, {"cantidad": p["cantidad"], "producto_id": p["producto_id"]})

        # Crear detalle actualizado
        detalle_actualizado = DetalleVenta(
            id=id,
            venta_id=detalle_existente.get_venta_id(),
            producto_id=nuevo_producto_id,
            combo_id=nuevo_combo_id,
            cantidad=nueva_cantidad,
            precio_unitario=precio_unitario
        )

        # Guardar detalle
        self.repo.store(detalle_actualizado)

        # Actualizar total en tienda.ventas
        self._actualizar_total_venta(detalle_existente.get_venta_id())

    def _actualizar_total_venta(self, venta_id: int) -> None:
        fila = self.db.queryone("""
            SELECT COALESCE(SUM(subtotal), 0) AS total
            FROM tienda.detalles_venta
            WHERE venta_id = %(venta_id)s
        """, {"venta_id": venta_id})

        total = Decimal(str(fila["total"]))

        self.db.execute("""
            UPDATE tienda.ventas
            SET total = %(total)s
            WHERE id = %(venta_id)s
        """, {"total": total, "venta_id": venta_id})
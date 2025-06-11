from administrador.domain.detalles_venta.detalle_venta import DetalleVenta
from administrador.domain.detalles_venta.detalle_venta_repository_port import DetalleVentaRepositoryPort
from administrador.infrastructure.pg_command import PGCommand
from decimal import Decimal
from typing import Optional

class CrearDetalleVentaUseCase:
    def __init__(self, repo: DetalleVentaRepositoryPort, db: PGCommand):
        self.repo = repo
        self.db = db

    def execute(
        self,
        venta_id: int,
        producto_id: Optional[int] = None,
        combo_id: Optional[int] = None,
        cantidad: int = 1
    ) -> int:
        # Validar que se especifique producto_id o combo_id, pero no ambos
        if producto_id is None and combo_id is None:
            raise Exception("Debe especificarse producto_id o combo_id")
        if producto_id is not None and combo_id is not None:
            raise Exception("No se pueden especificar producto_id y combo_id simultáneamente")

        precio_unitario = None
        productos_a_restar = []

        if producto_id:
            # Caso: Producto individual
            fila = self.db.queryone("""
                SELECT precio, stock
                FROM tienda.productos
                WHERE id = %(producto_id)s
            """, {"producto_id": producto_id})

            if not fila:
                raise Exception(f"Producto con ID {producto_id} no encontrado en productos")

            precio_unitario = Decimal(str(fila["precio"]))
            stock_actual = fila["stock"]

            if stock_actual < cantidad:
                raise Exception(f"Stock insuficiente para producto ID {producto_id}: {stock_actual} disponible, {cantidad} solicitado")

            productos_a_restar.append({"producto_id": producto_id, "cantidad": cantidad})

        if combo_id:
            # Caso: Combo
            fila = self.db.queryone("""
                SELECT precio_con_descuento, stock, estado
                FROM tienda.combos
                WHERE id = %(combo_id)s
            """, {"combo_id": combo_id})

            if not fila:
                raise Exception(f"Combo con ID {combo_id} no encontrado")

            if not fila["estado"]:
                raise Exception(f"Combo con ID {combo_id} no está activo")

            precio_unitario = Decimal(str(fila["precio_con_descuento"]))
            stock_combo = fila["stock"]

            if stock_combo < cantidad:
                raise Exception(f"Stock insuficiente para combo ID {combo_id}: {stock_combo} disponible, {cantidad} solicitado")

            # Obtener productos del combo y verificar stock
            productos_combo = self.db.queryall("""
                SELECT producto_id, cantidad
                FROM tienda.combos_productos
                WHERE combo_id = %(combo_id)s
            """, {"combo_id": combo_id})

            for p in productos_combo:
                stock_fila = self.db.queryone("""
                    SELECT stock
                    FROM tienda.productos
                    WHERE id = %(producto_id)s
                """, {"producto_id": p["producto_id"]})

                if not stock_fila:
                    raise Exception(f"Producto con ID {p['producto_id']} no encontrado")

                stock_producto = stock_fila["stock"]
                cantidad_requerida = p["cantidad"] * cantidad

                if stock_producto < cantidad_requerida:
                    raise Exception(f"Stock insuficiente para producto ID {p['producto_id']}: {stock_producto} disponible, {cantidad_requerida} solicitado")

                productos_a_restar.append({"producto_id": p["producto_id"], "cantidad": cantidad_requerida})

            # Restar stock del combo
            self.db.execute("""
                UPDATE tienda.combos
                SET stock = stock - %(cantidad)s
                WHERE id = %(combo_id)s
            """, {"cantidad": cantidad, "combo_id": combo_id})

        # Validar venta_id
        if not self.db.queryone("SELECT id FROM tienda.ventas WHERE id = %(id)s", {"id": venta_id}):
            raise Exception(f"Venta con ID {venta_id} no existe")

        # Restar stock de los productos
        for p in productos_a_restar:
            self.db.execute("""
                UPDATE tienda.productos
                SET stock = stock - %(cantidad)s
                WHERE id = %(producto_id)s
            """, {"cantidad": p["cantidad"], "producto_id": p["producto_id"]})

        # Crear detalle
        nuevo_id = self.repo.next_identity()
        detalle = DetalleVenta(
            id=nuevo_id,
            venta_id=venta_id,
            producto_id=producto_id,
            combo_id=combo_id,
            cantidad=cantidad,
            precio_unitario=precio_unitario
        )

        # Guardar detalle
        self.repo.store(detalle)

        # Actualizar total en tienda.ventas
        self._actualizar_total_venta(venta_id)

        return nuevo_id

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
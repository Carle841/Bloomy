from typing import List
from administrador.domain.detalles_venta.detalle_venta import DetalleVenta
from administrador.domain.detalles_venta.detalle_venta_repository_port import DetalleVentaRepositoryPort
from administrador.infrastructure.pg_command import PGCommand
from decimal import Decimal

class DetalleVentaService:
    def __init__(self, detalle_repository: DetalleVentaRepositoryPort, db: PGCommand):
        self.detalle_repository = detalle_repository
        self.db = db

    def add(self, venta_id: int, producto_id: int, cantidad: int) -> int:
        # Iniciar transacción
        try:
            # Obtener precio y stock desde tienda.productos
            fila = self.db.queryone("""
                SELECT precio, stock
                FROM tienda.productos
                WHERE id = %(producto_id)s
            """, {"producto_id": producto_id})

            if not fila:
                raise ValueError(f"Producto con ID {producto_id} no encontrado en productos")

            precio_unitario = Decimal(str(fila["precio"]))
            stock_actual = fila["stock"]

            if stock_actual < cantidad:
                raise ValueError(f"Stock insuficiente para producto ID {producto_id}: {stock_actual} disponible, {cantidad} solicitado")

            # Validar venta_id
            if not self.db.queryone("SELECT id FROM tienda.ventas WHERE id = %(id)s", {"id": venta_id}):
                raise ValueError(f"Venta con ID {venta_id} no existe")

            # Crear detalle
            nuevo_id = self.detalle_repository.next_identity()
            detalle = DetalleVenta(
                id=nuevo_id,
                venta_id=venta_id,
                producto_id=producto_id,
                cantidad=cantidad,
                precio_unitario=precio_unitario
            )

            # Restar stock
            self.db.execute("""
                UPDATE tienda.productos
                SET stock = stock - %(cantidad)s
                WHERE id = %(producto_id)s
            """, {"cantidad": cantidad, "producto_id": producto_id})

            # Guardar detalle
            self.detalle_repository.store(detalle)

            # Actualizar total en tienda.ventas
            self._actualizar_total_venta(venta_id)

            return nuevo_id

        except Exception as e:
            # Revertir transacción en caso de error
            raise e

    def delete(self, detalle_id: int) -> None:
        # Iniciar transacción
        try:
            # Obtener detalle para restaurar stock
            detalle = self.detalle_repository.get_by_id(detalle_id)
            if not detalle:
                raise ValueError(f"Detalle con ID {detalle_id} no encontrado")

            # Restaurar stock
            self.db.execute("""
                UPDATE tienda.productos
                SET stock = stock + %(cantidad)s
                WHERE id = %(producto_id)s
            """, {"cantidad": detalle.get_cantidad(), "producto_id": detalle.get_producto_id()})

            # Eliminar detalle
            self.detalle_repository.delete(detalle_id)

            # Actualizar total en tienda.ventas
            self._actualizar_total_venta(detalle.get_venta_id())

        except Exception as e:
            # Revertir transacción en caso de error
            raise e

    def find_by_venta_id(self, venta_id: int) -> List[DetalleVenta]:
        return self.detalle_repository.find_by_venta_id(venta_id)

    def _actualizar_total_venta(self, venta_id: int) -> None:
        # Calcular suma de subtotales
        fila = self.db.queryone("""
            SELECT COALESCE(SUM(subtotal), 0) AS total
            FROM tienda.detalles_venta
            WHERE venta_id = %(venta_id)s
        """, {"venta_id": venta_id})

        total = Decimal(str(fila["total"]))

        # Actualizar total en tienda.ventas
        self.db.execute("""
            UPDATE tienda.ventas
            SET total = %(total)s
            WHERE id = %(venta_id)s
        """, {"total": total, "venta_id": venta_id})
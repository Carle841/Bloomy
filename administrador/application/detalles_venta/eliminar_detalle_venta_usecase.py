from administrador.domain.detalles_venta.detalle_venta_repository_port import DetalleVentaRepositoryPort
from administrador.infrastructure.pg_command import PGCommand
from decimal import Decimal

class EliminarDetalleVentaUseCase:
    def __init__(self, repo: DetalleVentaRepositoryPort, db: PGCommand):
        self.repo = repo
        self.db = db

    def execute(self, id: int) -> None:
        # Obtener detalle
        detalle = self.repo.get_by_id(id)
        if not detalle:
            raise Exception("Detalle de venta no encontrado")

        # Restaurar stock
        if detalle.get_producto_id():
            self.db.execute("""
                UPDATE tienda.productos
                SET stock = stock + %(cantidad)s
                WHERE id = %(producto_id)s
            """, {"cantidad": detalle.get_cantidad(), "producto_id": detalle.get_producto_id()})
        elif detalle.get_combo_id():
            self.db.execute("""
                UPDATE tienda.combos
                SET stock = stock + %(cantidad)s
                WHERE id = %(combo_id)s
            """, {"cantidad": detalle.get_cantidad(), "combo_id": detalle.get_combo_id()})

            productos_combo = self.db.queryall("""
                SELECT producto_id, cantidad
                FROM tienda.combos_productos
                WHERE combo_id = %(combo_id)s
            """, {"combo_id": detalle.get_combo_id()})

            for p in productos_combo:
                self.db.execute("""
                    UPDATE tienda.productos
                    SET stock = stock + %(cantidad)s
                    WHERE id = %(producto_id)s
                """, {"cantidad": p["cantidad"] * detalle.get_cantidad(), "producto_id": p["producto_id"]})

        # Eliminar detalle
        self.repo.delete(id)

        # Actualizar total en tienda.ventas
        self._actualizar_total_venta(detalle.get_venta_id())

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
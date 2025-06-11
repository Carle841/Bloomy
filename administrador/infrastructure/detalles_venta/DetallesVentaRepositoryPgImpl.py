from typing import List, Optional
from decimal import Decimal
from administrador.domain.detalles_venta.detalle_venta import DetalleVenta
from administrador.domain.detalles_venta.detalle_venta_repository_port import DetalleVentaRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class DetallesVentaRepositoryPgImpl(DetalleVentaRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def store(self, detalle: DetalleVenta) -> None:
        sql = """
        INSERT INTO tienda.detalles_venta (
            id, venta_id, producto_id, combo_id, cantidad, precio_unitario, subtotal
        ) VALUES (
            %(id)s, %(venta_id)s, %(producto_id)s, %(combo_id)s,
            %(cantidad)s, %(precio_unitario)s, %(subtotal)s
        )
        ON CONFLICT (id) DO UPDATE
        SET venta_id = EXCLUDED.venta_id,
            producto_id = EXCLUDED.producto_id,
            combo_id = EXCLUDED.combo_id,
            cantidad = EXCLUDED.cantidad,
            precio_unitario = EXCLUDED.precio_unitario,
            subtotal = EXCLUDED.subtotal
        """
        self.db.execute(sql, {
            "id": detalle.get_id(),
            "venta_id": detalle.get_venta_id(),
            "producto_id": detalle.get_producto_id(),
            "combo_id": detalle.get_combo_id(),
            "cantidad": detalle.get_cantidad(),
            "precio_unitario": detalle.get_precio_unitario(),
            "subtotal": detalle.get_subtotal()
        })

    def find_by_venta_id(self, venta_id: int) -> List[DetalleVenta]:
        filas = self.db.queryall("""
            SELECT id, venta_id, producto_id, combo_id, cantidad, precio_unitario, subtotal
            FROM tienda.detalles_venta
            WHERE venta_id = %(venta_id)s
        """, {"venta_id": venta_id})

        return [
            DetalleVenta(
                id=f["id"],
                venta_id=f["venta_id"],
                producto_id=f["producto_id"],
                combo_id=f["combo_id"],
                cantidad=f["cantidad"],
                precio_unitario=f["precio_unitario"]
            ) for f in filas
        ]

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.detalles_venta_id_seq') AS id", {})
        return fila["id"]

    def get_by_id(self, id: int) -> Optional[DetalleVenta]:
        fila = self.db.queryone("""
            SELECT id, venta_id, producto_id, combo_id, cantidad, precio_unitario, subtotal
            FROM tienda.detalles_venta
            WHERE id = %(id)s
        """, {"id": id})

        if not fila:
            return None

        return DetalleVenta(
            id=fila["id"],
            venta_id=fila["venta_id"],
            producto_id=fila["producto_id"],
            combo_id=fila["combo_id"],
            cantidad=fila["cantidad"],
            precio_unitario=fila["precio_unitario"]
        )

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.detalles_venta WHERE id = %(id)s", {"id": id})
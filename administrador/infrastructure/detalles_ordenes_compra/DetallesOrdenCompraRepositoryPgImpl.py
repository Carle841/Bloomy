from typing import List, Optional
from administrador.domain.detalles_ordenes_compra.detalle_orden_compra import DetallesOrdenesCompra
from administrador.domain.detalles_ordenes_compra.detalle_orden_compra_repository_port import DetallesOrdenesCompraRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class DetallesOrdenesComprasRepositoryPgImpl(DetallesOrdenesCompraRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def store(self, detalle: DetallesOrdenesCompra) -> None:
        sql = """
        INSERT INTO tienda.detalles_orden_compra (
            id, orden_compra_id, producto_id, cantidad, precio_unitario
        ) VALUES (
            %(id)s, %(orden_compra_id)s, %(producto_id)s, %(cantidad)s, %(precio_unitario)s
        )
        ON CONFLICT (id) DO UPDATE 
        SET orden_compra_id = EXCLUDED.orden_compra_id,
            producto_id = EXCLUDED.producto_id,
            cantidad = EXCLUDED.cantidad,
            precio_unitario = EXCLUDED.precio_unitario
        """
        self.db.execute(sql, {
            "id": detalle.get_id(),
            "orden_compra_id": detalle.get_orden_compra_id(),
            "producto_id": detalle.get_producto_id(),
            "cantidad": detalle.get_cantidad(),
            "precio_unitario": detalle.get_precio_unitario()
        })

    def find_by_orden_compra_id(self, orden_compra_id: int) -> List[DetallesOrdenesCompra]:
        filas = self.db.queryall("""
            SELECT id, orden_compra_id, producto_id, cantidad, precio_unitario
            FROM tienda.detalles_orden_compra
            WHERE orden_compra_id = %(orden_compra_id)s
        """, {"orden_compra_id": orden_compra_id})

        return [
            DetallesOrdenesCompra(
                id=f["id"],
                orden_compra_id=f["orden_compra_id"],
                producto_id=f["producto_id"],
                cantidad=f["cantidad"],
                precio_unitario=f["precio_unitario"]
            ) for f in filas
        ]

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.detalles_orden_compra_id_seq') AS id", {})
        return fila["id"]

    def get_by_id(self, id: int) -> Optional[DetallesOrdenesCompra]:
        fila = self.db.queryone("""
            SELECT id, orden_compra_id, producto_id, cantidad, precio_unitario
            FROM tienda.detalles_orden_compra
            WHERE id = %(id)s
        """, {"id": id})

        if not fila:
            return None

        return DetallesOrdenesCompra(
            id=fila["id"],
            orden_compra_id=fila["orden_compra_id"],
            producto_id=fila["producto_id"],
            cantidad=fila["cantidad"],
            precio_unitario=fila["precio_unitario"]
        )

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.detalles_orden_compra WHERE id = %(id)s", {"id": id})
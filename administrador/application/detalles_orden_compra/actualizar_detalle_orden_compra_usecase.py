from administrador.domain.detalles_ordenes_compra.detalle_orden_compra import DetallesOrdenesCompra
from administrador.domain.detalles_ordenes_compra.detalle_orden_compra_repository_port import DetallesOrdenesCompraRepositoryPort
from administrador.infrastructure.pg_command import PGCommand
from decimal import Decimal
from typing import Optional

class ActualizarDetalleOrdenCompraUseCase:
    def __init__(self, repo: DetallesOrdenesCompraRepositoryPort, db: PGCommand):
        self.repo = repo
        self.db = db

    def execute(self, id: int, producto_id: Optional[int], cantidad: Optional[int]) -> None:
        # Obtener detalle existente
        detalle_existente = self.repo.get_by_id(id)
        if not detalle_existente:
            raise Exception("Detalle de orden de compra no encontrado")

        # Obtener nuevo precio_unitario si producto_id cambió
        nuevo_producto_id = producto_id if producto_id is not None else detalle_existente.get_producto_id()
        fila = self.db.queryone("""
            SELECT precio
            FROM tienda.inventario
            WHERE id = %(producto_id)s
        """, {"producto_id": nuevo_producto_id})

        if not fila:
            raise Exception(f"Producto con ID {nuevo_producto_id} no encontrado en inventario")

        precio_unitario = Decimal(str(fila["precio"]))

        # Usar cantidad existente si no se proporciona
        nueva_cantidad = cantidad if cantidad is not None else detalle_existente.get_cantidad()

        # Crear detalle actualizado
        detalle_actualizado = DetallesOrdenesCompra(
            id=id,
            orden_compra_id=detalle_existente.get_orden_compra_id(),
            producto_id=nuevo_producto_id,
            cantidad=nueva_cantidad,
            precio_unitario=precio_unitario
        )

        self.repo.store(detalle_actualizado)
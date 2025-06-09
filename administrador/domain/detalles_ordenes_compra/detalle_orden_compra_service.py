from typing import List
from administrador.domain.detalles_ordenes_compra.detalle_orden_compra import DetallesOrdenesCompra
from administrador.domain.detalles_ordenes_compra.detalle_orden_compra_repository_port import DetallesOrdenesCompraRepositoryPort
from administrador.infrastructure.pg_command import PGCommand
from decimal import Decimal

class DetallesOrdenesCompraService:
    def __init__(self, detalle_repository: DetallesOrdenesCompraRepositoryPort, db: PGCommand):
        self.detalle_repository = detalle_repository
        self.db = db

    def add(self, orden_compra_id: int, producto_id: int, cantidad: int) -> int:
        # Obtener precio_unitario desde tienda.inventario
        fila = self.db.queryone("""
            SELECT precio
            FROM tienda.inventario
            WHERE id = %(producto_id)s
        """, {"producto_id": producto_id})

        if not fila:
            raise ValueError(f"Producto con ID {producto_id} no encontrado en inventario")

        precio_unitario = Decimal(str(fila["precio"]))

        # Validar orden_compra_id
        if not self.db.queryone("SELECT id FROM tienda.ordenes_compra WHERE id = %(id)s", {"id": orden_compra_id}):
            raise ValueError(f"Orden de compra con ID {orden_compra_id} no existe")

        # Crear detalle
        nuevo_id = self.detalle_repository.next_identity()
        detalle = DetallesOrdenesCompra(
            id=nuevo_id,
            orden_compra_id=orden_compra_id,
            producto_id=producto_id,
            cantidad=cantidad,
            precio_unitario=precio_unitario
        )

        self.detalle_repository.store(detalle)
        return nuevo_id

    def find_by_orden_compra_id(self, orden_compra_id: int) -> List[DetallesOrdenesCompra]:
        return self.detalle_repository.find_by_orden_compra_id(orden_compra_id)
from administrador.domain.detalles_ordenes_compra.detalle_orden_compra import DetallesOrdenesCompra
from administrador.domain.detalles_ordenes_compra.detalle_orden_compra_repository_port import DetallesOrdenesCompraRepositoryPort
from administrador.infrastructure.pg_command import PGCommand
from decimal import Decimal

class CrearDetalleOrdenCompraUseCase:
    def __init__(self, repo: DetallesOrdenesCompraRepositoryPort, db: PGCommand):
        self.repo = repo
        self.db = db

    def execute(self, orden_compra_id: int, producto_id: int, cantidad: int) -> int:
        # Validar producto_id
        fila = self.db.queryone("""
            SELECT precio
            FROM tienda.inventario
            WHERE id = %(producto_id)s
        """, {"producto_id": producto_id})

        if not fila:
            raise Exception(f"Producto con ID {producto_id} no encontrado en inventario")

        precio_unitario = Decimal(str(fila["precio"]))

        # Validar orden_compra_id
        if not self.db.queryone("SELECT id FROM tienda.ordenes_compra WHERE id = %(id)s", {"id": orden_compra_id}):
            raise Exception(f"Orden de compra con ID {orden_compra_id} no existe")

        # Crear detalle
        nuevo_id = self.repo.next_identity()
        detalle = DetallesOrdenesCompra(
            id=nuevo_id,
            orden_compra_id=orden_compra_id,
            producto_id=producto_id,
            cantidad=cantidad,
            precio_unitario=precio_unitario
        )

        self.repo.store(detalle)
        return nuevo_id
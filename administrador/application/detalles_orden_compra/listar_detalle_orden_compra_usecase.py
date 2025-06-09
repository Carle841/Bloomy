from typing import List
from administrador.domain.detalles_ordenes_compra.detalle_orden_compra import DetallesOrdenesCompra
from administrador.domain.detalles_ordenes_compra.detalle_orden_compra_repository_port import DetallesOrdenesCompraRepositoryPort

class ListarDetalleOrdenCompraUseCase:
    def __init__(self, repo: DetallesOrdenesCompraRepositoryPort):
        self.repo = repo

    def execute(self, orden_compra_id: int) -> List[DetallesOrdenesCompra]:
        return self.repo.find_by_orden_compra_id(orden_compra_id)
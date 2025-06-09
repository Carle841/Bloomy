from administrador.domain.orden_compra.orden_compra_repository_port import OrdenCompraRepositoryPort
from typing import List
from administrador.domain.orden_compra.orden_compra import OrdenCompra

class BuscarOrdenCompraUseCase:
    def __init__(self, repo: OrdenCompraRepositoryPort):
        self.repo = repo

    def execute(self, busqueda: str) -> List[OrdenCompra]:
        return self.repo.find(busqueda)
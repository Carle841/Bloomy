from administrador.domain.ventas.venta_repository_port import VentaRepositoryPort
from typing import List
from administrador.domain.ventas.venta import Venta

class BuscarVentaUseCase:
    def __init__(self, repo: VentaRepositoryPort):
        self.repo = repo

    def execute(self, busqueda: str) -> List[Venta]:
        return self.repo.find(busqueda)
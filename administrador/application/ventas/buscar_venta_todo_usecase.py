from administrador.domain.ventas.venta_repository_port import VentaRepositoryPort
from typing import Optional
from administrador.domain.ventas.venta_completa import VentaCompleta

class BuscarVentaTodoUseCase:
    def __init__(self, repo: VentaRepositoryPort):
        self.repo = repo

    def execute(self, id: int) -> Optional[VentaCompleta]:
        return self.repo.buscar_venta_todo(id)
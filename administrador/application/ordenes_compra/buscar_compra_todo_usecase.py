from administrador.domain.orden_compra.orden_compra_repository_port import OrdenCompraRepositoryPort
from typing import Optional
from administrador.domain.orden_compra.orden_compra_completa import OrdenCompraCompleta

class BuscarCompraTodoUseCase:
    def __init__(self, repo: OrdenCompraRepositoryPort):
        self.repo = repo

    def execute(self, id: int) -> Optional[OrdenCompraCompleta]:
        return self.repo.buscar_compra_todo(id)
from administrador.domain.orden_compra.orden_compra_repository_port import OrdenCompraRepositoryPort

class ContarProductosOrdenUseCase:
    def __init__(self, repo: OrdenCompraRepositoryPort):
        self.repo = repo

    def execute(self, id: int) -> int:
        return self.repo.contar_productos_orden(id)
from administrador.domain.orden_compra.orden_compra_repository_port import OrdenCompraRepositoryPort

class EliminarOrdenCompraUseCase:
    def __init__(self, repo: OrdenCompraRepositoryPort):
        self.repo = repo

    def execute(self, id: int) -> None:
        if not self.repo.get_by_id(id):
            raise Exception("Orden de compra no encontrada")
        self.repo.delete(id)
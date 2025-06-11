from administrador.domain.ventas.venta_repository_port import VentaRepositoryPort

class EliminarVentaUseCase:
    def __init__(self, repo: VentaRepositoryPort):
        self.repo = repo

    def execute(self, id: int) -> None:
        if not self.repo.get_by_id(id):
            raise Exception("Venta no encontrada")
        self.repo.delete(id)
from administrador.domain.inventario.inventario_repository_port import InventarioRepositoryPort

class BuscarInventarioUseCase:
    def __init__(self, repo: InventarioRepositoryPort):
        self.repo = repo

    def execute(self, filtro: str):
        return self.repo.find(filtro)

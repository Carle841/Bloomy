from administrador.domain.proveedores.proveedor_repository_port import ProveedorRepositoryPort

class BuscarProveedorUseCase:
    def __init__(self, repo: ProveedorRepositoryPort):
        self.repo = repo

    def execute(self, filtro: str):
        return self.repo.find(filtro)

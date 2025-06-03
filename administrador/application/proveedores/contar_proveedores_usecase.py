from administrador.domain.proveedores.proveedor_repository_port import ProveedorRepositoryPort

class ContarProveedoresUseCase:
    def __init__(self, repo: ProveedorRepositoryPort):
        self.repo = repo

    def execute(self):
        return self.repo.count_all()

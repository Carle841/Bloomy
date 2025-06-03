from administrador.domain.proveedores.proveedor_repository_port import ProveedorRepositoryPort

class EliminarProveedorUseCase:
    def __init__(self, repo: ProveedorRepositoryPort):
        self.repo = repo

    def execute(self, id):
        proveedor_existente = self.repo.get_by_id(id)
        if not proveedor_existente:
            raise Exception("Proveedor no encontrado")
        
        self.repo.delete(id)

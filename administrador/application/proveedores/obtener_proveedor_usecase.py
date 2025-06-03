from administrador.domain.proveedores.proveedor_repository_port import ProveedorRepositoryPort

class ObtenerProveedorUseCase:
    def __init__(self, repo: ProveedorRepositoryPort):
        self.repo = repo

    def execute(self, id):
        proveedor_existente = self.repo.get_by_id(id)
        if not proveedor_existente:
            raise Exception("Proveedor no encontrado")
        
        return proveedor_existente

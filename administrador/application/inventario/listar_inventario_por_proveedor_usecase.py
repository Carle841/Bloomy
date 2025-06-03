from administrador.domain.inventario.inventario_repository_port import InventarioRepositoryPort
from administrador.domain.proveedores.proveedor_repository_port import ProveedorRepositoryPort

class ListarInventarioPorProveedorUseCase:
    def __init__(self, inventario_repo: InventarioRepositoryPort, proveedor_repo: ProveedorRepositoryPort):
        self.inventario_repo = inventario_repo
        self.proveedor_repo = proveedor_repo

    def execute(self, proveedor_id: int):
        proveedor = self.proveedor_repo.get_by_id(proveedor_id)
        if not proveedor:
            raise Exception("Proveedor no encontrado")

        inventarios = self.inventario_repo.find_by_proveedor(proveedor_id)
        return inventarios, proveedor.get_nombre()

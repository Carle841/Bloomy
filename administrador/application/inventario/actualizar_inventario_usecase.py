from administrador.domain.inventario.inventario_repository_port import InventarioRepositoryPort
from administrador.domain.inventario.inventario import Inventario

class ActualizarInventarioUseCase:
    def __init__(self, repo: InventarioRepositoryPort):
        self.repo = repo

    def execute(self, id, nombre, descripcion, precio, proveedor_id):
        inventario_existente = self.repo.get_by_id(id)
        if not inventario_existente:
            raise Exception("Inventario no encontrado")
        
        inventario_actualizado = Inventario(
            id=id,
            nombre=nombre,
            descripcion=descripcion,
            precio=precio,
            proveedor_id=proveedor_id
        )
        self.repo.store(inventario_actualizado)

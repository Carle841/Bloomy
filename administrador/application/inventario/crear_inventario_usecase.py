from administrador.domain.inventario.inventario_repository_port import InventarioRepositoryPort
from administrador.domain.inventario.inventario import Inventario

class CrearInventarioUseCase:
    def __init__(self, repo: InventarioRepositoryPort):
        self.repo = repo

    def execute(self, nombre, descripcion, precio, proveedor_id):
        nuevo_id = self.repo.next_identity()
        inventario = Inventario(
            id=nuevo_id,
            nombre=nombre,
            descripcion=descripcion,
            precio=precio,
            proveedor_id=proveedor_id
        )
        self.repo.store(inventario)
        return nuevo_id

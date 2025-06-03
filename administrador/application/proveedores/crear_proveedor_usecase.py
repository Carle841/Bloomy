from administrador.domain.proveedores.proveedor_repository_port import ProveedorRepositoryPort
from administrador.domain.proveedores.proveedor import Proveedor

class CrearProveedorUseCase:
    def __init__(self, repo: ProveedorRepositoryPort):
        self.repo = repo

    def execute(self, nombre, contacto, telefono, email, direccion):
        nuevo_id = self.repo.next_identity()
        proveedor = Proveedor(
            id=nuevo_id,
            nombre=nombre,
            contacto=contacto,
            telefono=telefono,
            email=email,
            direccion=direccion
        )
        self.repo.store(proveedor)
        return nuevo_id

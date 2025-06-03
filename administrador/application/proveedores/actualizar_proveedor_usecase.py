from administrador.domain.proveedores.proveedor_repository_port import ProveedorRepositoryPort
from administrador.domain.proveedores.proveedor import Proveedor

class ActualizarProveedorUseCase:
    def __init__(self, repo: ProveedorRepositoryPort):
        self.repo = repo

    def execute(self, id, nombre, contacto, telefono, email, direccion):
        proveedor_existente = self.repo.get_by_id(id)
        if not proveedor_existente:
            raise Exception("Proveedor no encontrado")
        
        proveedor_actualizado = Proveedor(
            id=id,
            nombre=nombre,
            contacto=contacto,
            telefono=telefono,
            email=email,
            direccion=direccion
        )
        self.repo.store(proveedor_actualizado)

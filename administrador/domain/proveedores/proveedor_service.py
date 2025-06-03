from administrador.domain.proveedores.proveedor import Proveedor
from administrador.domain.proveedores.proveedor_repository_port import ProveedorRepositoryPort

class ProveedorService:
    def __init__(self, proveedor_repository: ProveedorRepositoryPort):
        self.proveedor_repository = proveedor_repository

    def add(self, proveedor: Proveedor) -> None:
        self.proveedor_repository.store(proveedor)

    def get_by_id(self, id: int) -> Proveedor | None:
        return self.proveedor_repository.get_by_id(id)

    def find_all(self, filtro: str) -> list[Proveedor]:
        return self.proveedor_repository.find(filtro)

    def remove(self, id: int) -> None:
        self.proveedor_repository.delete(id)

    def update(self, proveedor: Proveedor) -> None:
        self.proveedor_repository.store(proveedor)

    def get_next_id(self) -> int:
        return self.proveedor_repository.next_identity()

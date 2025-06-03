from administrador.domain.inventario.inventario import Inventario
from administrador.domain.inventario.inventario_repository_port import InventarioRepositoryPort

class InventarioService:
    def __init__(self, inventario_repository: InventarioRepositoryPort):
        self.inventario_repository = inventario_repository

    def add(self, inventario: Inventario) -> None:
        self.inventario_repository.store(inventario)

    def get_by_id(self, id: int) -> Inventario | None:
        return self.inventario_repository.get_by_id(id)

    def find_all(self, filtro: str) -> list[Inventario]:
        return self.inventario_repository.find(filtro)

    def remove(self, id: int) -> None:
        self.inventario_repository.delete(id)

    def update(self, inventario: Inventario) -> None:
        self.inventario_repository.store(inventario)

    def get_next_id(self) -> int:
        return self.inventario_repository.next_identity()

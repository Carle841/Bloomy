from abc import ABC, abstractmethod
from administrador.domain.inventario.inventario import Inventario

class InventarioRepositoryPort(ABC):

    @abstractmethod
    def store(self, inventario: Inventario) -> None:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass

    @abstractmethod
    def find(self, filtro: str) -> list[Inventario]:
        pass

    @abstractmethod
    def get_by_id(self, id: int) -> Inventario | None:
        pass

    @abstractmethod
    def next_identity(self) -> int:
        pass

    @abstractmethod
    def find_by_proveedor(self, proveedor_id: int) -> list[Inventario]:
        pass

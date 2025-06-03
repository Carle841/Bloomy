from abc import ABC, abstractmethod
from administrador.domain.proveedores.proveedor import Proveedor

class ProveedorRepositoryPort(ABC):
    @abstractmethod
    def get_by_id(self, id: int) -> Proveedor | None:
        pass

    @abstractmethod
    def store(self, proveedor: Proveedor) -> None:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass

    @abstractmethod
    def next_identity(self) -> int:
        pass

    @abstractmethod
    def find(self, filtro: str) -> list[Proveedor]:
        pass

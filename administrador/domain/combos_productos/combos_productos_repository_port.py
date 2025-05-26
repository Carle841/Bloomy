from abc import ABC, abstractmethod
from administrador.domain.combos_productos.combos_productos import ComboProducto

class ComboProductoRepositoryPort(ABC):
    @abstractmethod
    def get_by_id(self, combo_id: int, producto_id: int) -> ComboProducto | None:
        pass

    @abstractmethod
    def store(self, combo_producto: ComboProducto) -> None:
        pass

    @abstractmethod
    def delete(self, combo_id: int, producto_id: int) -> None:
        pass

    @abstractmethod
    def next_identity(self) -> tuple[int, int]:
        pass

    @abstractmethod
    def find(self, combo_id: int) -> list[ComboProducto]:
        pass
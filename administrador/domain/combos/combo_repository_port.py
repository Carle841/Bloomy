from abc import ABC, abstractmethod
from administrador.domain.combos.combo import Combo

class ComboRepositoryPort(ABC):
    @abstractmethod
    def get_by_id(self, id: int) -> Combo | None:
        pass

    @abstractmethod
    def store(self, combo: Combo) -> None:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass

    @abstractmethod
    def next_identity(self) -> int:
        pass

    @abstractmethod
    def find(self, filtro: str) -> list[Combo]:
        pass

    @abstractmethod
    def find_by_id(self, id: int) -> Combo | None:
        pass

    @abstractmethod
    def update(self, combo: Combo) -> None:
        pass

    @abstractmethod
    def update_precios(self, combo_id: int, precio_sin_descuento: float, precio_con_descuento: float) -> None:
        pass
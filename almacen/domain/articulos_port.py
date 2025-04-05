from abc import ABC, abstractmethod

from .articulo import Articulo


class ArticulosPort(ABC):

    @abstractmethod
    def get_by_id(self, id: int) -> Articulo | None:
        pass

    @abstractmethod
    def find_all(self, filtro: str) -> list:
        pass

    @abstractmethod
    def save(self, articulo: Articulo) -> None:
        pass

    @abstractmethod
    def delete(self, articuloId: int) -> None:
        pass

    @abstractmethod
    def get_next_id(self) -> int:
        pass

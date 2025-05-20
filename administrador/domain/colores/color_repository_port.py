from abc import ABC, abstractmethod
from administrador.domain.colores.color import Color

class ColorRepositoryPort(ABC):
    @abstractmethod
    def get_by_id(self, id: int) -> Color | None:
        pass

    @abstractmethod
    def store(self, color: Color) -> None:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass

    @abstractmethod
    def next_identity(self) -> int:
        pass

    @abstractmethod
    def find(self, filtro: str) -> list[Color]:
        pass

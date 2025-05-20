from abc import ABC, abstractmethod
from administrador.domain.iconos.icono import Icono

class IconoRepositoryPort(ABC):
    @abstractmethod
    def next_identity(self) -> int:
        pass

    @abstractmethod
    def store(self, icono: Icono) -> None:
        pass

    @abstractmethod
    def get_by_id(self, id: int) -> Icono | None:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass

    @abstractmethod
    def find(self, filtro: str) -> list[Icono]:
        pass

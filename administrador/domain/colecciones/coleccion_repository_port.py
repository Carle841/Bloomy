from abc import ABC, abstractmethod
from administrador.domain.colecciones.coleccion import Coleccion

class ColeccionRepositoryPort(ABC):
    @abstractmethod
    def next_identity(self) -> int: pass

    @abstractmethod
    def store(self, coleccion: Coleccion) -> None: pass

    @abstractmethod
    def get_by_id(self, id: int) -> Coleccion | None: pass

    @abstractmethod
    def delete(self, id: int) -> None: pass

    @abstractmethod
    def find(self, filtro: str) -> list[Coleccion]: pass

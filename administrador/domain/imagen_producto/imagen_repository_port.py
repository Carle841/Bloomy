from abc import ABC, abstractmethod
from administrador.domain.imagen_producto.imagen import Imagen

class ImagenRepositoryPort(ABC):
    @abstractmethod
    def next_identity(self) -> int:
        pass

    @abstractmethod
    def store(self, imagen: Imagen) -> None:
        pass

    @abstractmethod
    def get_by_id(self, id: int) -> Imagen | None:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass

    @abstractmethod
    def find(self, filtro: str) -> list[Imagen]:
        pass

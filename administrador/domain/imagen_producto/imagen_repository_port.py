from abc import ABC, abstractmethod
from administrador.domain.imagen_producto.imagen import Imagen

class ImagenRepositoryPort(ABC):
    @abstractmethod
    def next_identity(self) -> int:
        """Genera el próximo ID disponible para una imagen."""
        pass

    @abstractmethod
    def store(self, imagen: Imagen) -> None:
        """Guarda una nueva imagen en el repositorio."""
        pass

    @abstractmethod
    def get_by_id(self, id: int) -> Imagen | None:
        """Devuelve una imagen por su ID o None si no existe."""
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        """Elimina una imagen por su ID."""
        pass

    @abstractmethod
    def find(self, producto_id: int) -> list[Imagen]:
        """Devuelve todas las imágenes asociadas a un producto específico."""
        pass

from abc import ABC, abstractmethod
from administrador.domain.productos.producto import Producto

class ProductoRepositoryPort(ABC):
    @abstractmethod
    def next_identity(self) -> int:
        """Genera el próximo ID disponible para un producto."""
        pass

    @abstractmethod
    def store(self, producto: Producto) -> None:
        """Guarda un nuevo producto en el repositorio."""
        pass

    @abstractmethod
    def get_by_id(self, id: int) -> Producto | None:
        """Devuelve un producto por su ID o None si no existe."""
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        """Elimina un producto por su ID."""
        pass

    @abstractmethod
    def find(self, filtro: str) -> list[Producto]:
        """Busca productos que coincidan con un filtro."""
        pass
    
    @abstractmethod
    def obtener_productos_con_imagenes(self) -> list:
        pass
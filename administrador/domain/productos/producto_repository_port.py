from abc import ABC, abstractmethod
from administrador.domain.productos.producto import Producto

class ProductoRepositoryPort(ABC):
    @abstractmethod
    def next_identity(self) -> int:
        pass

    @abstractmethod
    def store(self, producto: Producto) -> None:
        pass

    @abstractmethod
    def get_by_id(self, id: int) -> Producto | None:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass

    @abstractmethod
    def find(self, filtro: str) -> list[Producto]:
        pass
    
    @abstractmethod
    def obtener_productos_con_imagenes(self) -> list:
        pass
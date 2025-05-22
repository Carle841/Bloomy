from abc import ABC, abstractmethod
from administrador.domain.categorias.categoria import Categoria

class CategoriaRepositoryPort(ABC):
    @abstractmethod
    def get_by_id(self, id: int) -> Categoria | None:
        pass

    @abstractmethod
    def store(self, categoria: Categoria) -> None:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass

    @abstractmethod
    def next_identity(self) -> int:
        pass

    @abstractmethod
    def find(self, filtro: str) -> list[Categoria]:
        pass
    
    @abstractmethod
    def find_with_details(self) -> list[dict]:
        pass


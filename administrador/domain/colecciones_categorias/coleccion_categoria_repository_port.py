from abc import ABC, abstractmethod
from administrador.domain.colecciones_categorias.coleccion_categoria import ColeccionCategoria

class ColeccionCategoriaRepositoryPort(ABC):

    @abstractmethod
    def add(self, coleccion_categoria: ColeccionCategoria) -> None:
        pass

    @abstractmethod
    def delete(self, coleccion_id: int, categoria_id: int) -> None:
        pass

    @abstractmethod
    def find_all(self) -> list[ColeccionCategoria]:
        pass

    @abstractmethod
    def find_by_coleccion(self, coleccion_id: int) -> list[ColeccionCategoria]:
        pass

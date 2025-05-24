from administrador.domain.colecciones_categorias.coleccion_categoria import ColeccionCategoria
from administrador.domain.colecciones_categorias.coleccion_categoria_repository_port import ColeccionCategoriaRepositoryPort

class ColeccionCategoriaService:
    def __init__(self, repository: ColeccionCategoriaRepositoryPort):
        self.repository = repository

    def add(self, coleccion_id: int, categoria_id: int):
        cc = ColeccionCategoria(coleccion_id, categoria_id)
        self.repository.add(cc)

    def delete(self, coleccion_id: int, categoria_id: int):
        self.repository.delete(coleccion_id, categoria_id)

    def list_all(self) -> list[ColeccionCategoria]:
        return self.repository.find_all()

    def list_by_coleccion(self, coleccion_id: int) -> list[ColeccionCategoria]:
        return self.repository.find_by_coleccion(coleccion_id)

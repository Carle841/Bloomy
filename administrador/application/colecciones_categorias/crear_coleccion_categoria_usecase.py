from administrador.domain.colecciones_categorias.coleccion_categoria import ColeccionCategoria
from administrador.domain.colecciones_categorias.coleccion_categoria_repository_port import ColeccionCategoriaRepositoryPort

class CrearColeccionCategoriaUseCase:
    def __init__(self, repository=ColeccionCategoriaRepositoryPort):
        self.repository = repository

    def execute(self, coleccion_id: int, categoria_id: int):
        entidad = ColeccionCategoria(coleccion_id, categoria_id)
        self.repository.add(entidad)
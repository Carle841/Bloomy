from administrador.domain.colecciones_categorias.coleccion_categoria_repository_port import ColeccionCategoriaRepositoryPort

class ObtenerColeccionCategoriaUseCase:
    def __init__(self, repository = ColeccionCategoriaRepositoryPort):
        self.repository = repository

    def execute(self, coleccion_id: int):
        return self.repository.find_by_coleccion(coleccion_id)
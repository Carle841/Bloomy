from administrador.domain.colecciones_categorias.coleccion_categoria_repository_port import ColeccionCategoriaRepositoryPort

class ContarCategoriasEnColeccionUseCase:
    def __init__(self, repository: ColeccionCategoriaRepositoryPort):
        self.repository = repository

    def execute(self, coleccion_id: int) -> int:
        return self.repository.count_categorias_by_coleccion(coleccion_id)

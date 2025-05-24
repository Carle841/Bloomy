from administrador.domain.colecciones_categorias.coleccion_categoria_repository_port import ColeccionCategoriaRepositoryPort

class EliminarColeccionCategoriaUseCase:
    def __init__(self, repository = ColeccionCategoriaRepositoryPort):
        self.repository = repository

    def execute(self, coleccion_id: int, categoria_id: int):
        self.repository.delete(coleccion_id, categoria_id)
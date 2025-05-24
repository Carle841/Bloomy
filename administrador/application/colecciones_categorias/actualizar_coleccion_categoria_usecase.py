from administrador.domain.colecciones_categorias.coleccion_categoria_repository_port import ColeccionCategoriaRepositoryPort

class EliminarColeccionCategoriaUseCase:
    def __init__(self, repository = ColeccionCategoriaRepositoryPort):
        self.repository = repository

    def execute(self, coleccion_id: int, categoria_id: int):
        self.repository.delete(coleccion_id, categoria_id)

class ActualizarColeccionCategoriaUseCase:
    def __init__(self, coleccion_categoria_repository = ColeccionCategoriaRepositoryPort):
        self.coleccion_categoria_repository = coleccion_categoria_repository

    def execute(self, coleccion_id: int, categoria_anterior_id: int, categoria_nueva_id: int):
        # Primero eliminar la relación anterior
        self.coleccion_categoria_repository.delete(
            coleccion_id=coleccion_id,
            categoria_id=categoria_anterior_id
        )

        # Luego crear la nueva relación
        self.coleccion_categoria_repository.add(
            coleccion_id=coleccion_id,
            categoria_id=categoria_nueva_id
        )

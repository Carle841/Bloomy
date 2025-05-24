from administrador.domain.colecciones.coleccion_repository_port import ColeccionRepositoryPort

class EliminarColeccionUseCase:
    def __init__(self, repository: ColeccionRepositoryPort):
        self.repository = repository

    def execute(self, coleccion_id: int) -> None:
        self.repository.delete(coleccion_id)

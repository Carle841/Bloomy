from administrador.domain.colecciones.coleccion_repository_port import ColeccionRepositoryPort
from administrador.domain.colecciones.coleccion import Coleccion

class ObtenerColeccionUseCase:
    def __init__(self, repository: ColeccionRepositoryPort):
        self.repository = repository

    def execute(self, coleccion_id: int) -> Coleccion | None:
        return self.repository.get_by_id(coleccion_id)

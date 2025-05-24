from administrador.domain.colecciones.coleccion_repository_port import ColeccionRepositoryPort
from administrador.domain.colecciones.coleccion import Coleccion

class BuscarColeccionUseCase:
    def __init__(self, repository: ColeccionRepositoryPort):
        self.repository = repository

    def execute(self, filtro: str) -> list[Coleccion]:
        return self.repository.find(filtro)

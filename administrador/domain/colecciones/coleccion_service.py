from administrador.domain.colecciones.coleccion import Coleccion
from administrador.domain.colecciones.coleccion_repository_port import ColeccionRepositoryPort

class ColeccionService:
    def __init__(self, coleccion_repository: ColeccionRepositoryPort):
        self.coleccion_repository = coleccion_repository

    def add(self, coleccion: Coleccion) -> None:
        self.coleccion_repository.store(coleccion)

    def get_by_id(self, id: int) -> Coleccion | None:
        return self.coleccion_repository.get_by_id(id)

    def find_all(self, filtro: str) -> list[Coleccion]:
        return self.coleccion_repository.find(filtro)

    def remove(self, id: int) -> None:
        self.coleccion_repository.delete(id)

    def update(self, coleccion: Coleccion) -> None:
        self.coleccion_repository.store(coleccion)

    def get_next_id(self) -> int:
        return self.coleccion_repository.next_identity()

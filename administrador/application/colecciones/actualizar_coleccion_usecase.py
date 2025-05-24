from administrador.domain.colecciones.coleccion import Coleccion
from administrador.domain.colecciones.coleccion_repository_port import ColeccionRepositoryPort
from datetime import datetime

class ActualizarColeccionUseCase:
    def __init__(self, repository: ColeccionRepositoryPort):
        self.repository = repository

    def execute(self, id: int, nombre: str, descripcion: str, imagen_url: str, estado: str) -> None:
        coleccion = Coleccion(
            id=id,
            nombre=nombre,
            descripcion=descripcion,
            imagen_url=imagen_url,
            estado=estado,
            fecha_creacion=datetime.now()
        )
        self.repository.store(coleccion)

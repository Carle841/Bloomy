from administrador.domain.imagen_producto.imagen_repository_port import ImagenRepositoryPort
from administrador.domain.imagen_producto.imagen import Imagen

class BuscarImagenUseCase:
    def __init__(self, repo: ImagenRepositoryPort):
        self.repo = repo

    def execute(self, filtro: str):
        return self.repo.find(filtro)
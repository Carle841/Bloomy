from administrador.domain.imagen_producto.imagen_repository_port import ImagenRepositoryPort
from administrador.domain.imagen_producto.imagen import Imagen

class ActualizarImagenUseCase:
    def __init__(self, repo: ImagenRepositoryPort):
        self.repo = repo

    def execute(self, id: int, producto_id: int, url: str) -> None:
        imagen_actualizada = Imagen(id=id, producto_id=producto_id, url=url)
        self.repo.store(imagen_actualizada)

from administrador.domain.imagen_producto.imagen_repository_port import ImagenRepositoryPort
from administrador.domain.imagen_producto.imagen import Imagen

class ObtenerImagenUseCase:
    def __init__(self, repo: ImagenRepositoryPort):
        self.repo = repo

    def execute(self, id: int) -> Imagen | None:
        return self.repo.get_by_id(id)

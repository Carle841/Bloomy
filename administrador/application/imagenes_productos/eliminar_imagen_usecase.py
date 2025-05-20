from administrador.domain.imagen_producto.imagen_repository_port import ImagenRepositoryPort

class EliminarImagenUseCase:
    def __init__(self, repo: ImagenRepositoryPort):
        self.repo = repo

    def execute(self, id: int) -> None:
        self.repo.delete(id)
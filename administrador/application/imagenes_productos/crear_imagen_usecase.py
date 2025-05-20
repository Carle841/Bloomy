from administrador.domain.imagen_producto.imagen import Imagen
from administrador.domain.imagen_producto.imagen_repository_port import ImagenRepositoryPort

class CrearImagenUseCase:
    def __init__(self, imagen_repository: ImagenRepositoryPort):
        self.imagen_repository = imagen_repository

    def execute(self, producto_id: int, url: str) -> int:
        nuevo_id = self.imagen_repository.next_identity()
        imagen = Imagen(
            id=nuevo_id,
            producto_id=producto_id,
            url=url
        )
        self.imagen_repository.store(imagen)
        return nuevo_id

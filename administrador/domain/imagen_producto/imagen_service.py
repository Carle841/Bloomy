from administrador.domain.imagen_producto.imagen import Imagen
from administrador.domain.imagen_producto.imagen_repository_port import ImagenRepositoryPort

class ImagenService:

    def __init__(self, imagen_repository: ImagenRepositoryPort):
        self.imagen_repository = imagen_repository

    def add(self, imagen: Imagen) -> None:
        self.imagen_repository.store(imagen)

    def get_by_id(self, id: int) -> Imagen | None:
        return self.imagen_repository.get_by_id(id)

    def find(self, producto_id: int) -> list[Imagen]:
        return self.imagen_repository.find(producto_id)

    def remove(self, id: int) -> None:
        self.imagen_repository.delete(id)

    def update(self, imagen: Imagen) -> None:
        self.imagen_repository.store(imagen)

    def get_next_id(self) -> int:
        return self.imagen_repository.next_identity()

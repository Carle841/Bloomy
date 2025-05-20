from administrador.domain.productos.producto import Producto
from administrador.domain.productos.producto_repository_port import ProductoRepositoryPort

class ProductoService:

    def __init__(self, producto_repository: ProductoRepositoryPort):
        self.producto_repository = producto_repository

    def add(self, producto: Producto) -> None:
        self.producto_repository.store(producto)

    def get_by_id(self, id: int) -> Producto | None:
        return self.producto_repository.get_by_id(id)

    def find_all(self, filtro: str) -> list[Producto]:
        return self.producto_repository.find(filtro)

    def remove(self, id: int) -> None:
        self.producto_repository.delete(id)

    def update(self, producto: Producto) -> None:
        self.producto_repository.store(producto)

    def get_next_id(self) -> int:
        return self.producto_repository.next_identity()

from administrador.domain.productos.producto import Producto
from administrador.domain.productos.producto_repository_port import ProductoRepositoryPort

class ObtenerProductoUseCase:
    def __init__(self, producto_repository: ProductoRepositoryPort):
        self.producto_repository = producto_repository

    def execute(self, id: int) -> Producto | None:
        return self.producto_repository.get_by_id(id)

from administrador.domain.productos.producto import Producto
from administrador.domain.productos.producto_repository_port import ProductoRepositoryPort

class BuscarProductoUseCase:
    def __init__(self, producto_repository: ProductoRepositoryPort):
        self.producto_repository = producto_repository

    def execute(self, filtro: str) -> list[Producto]:
        return self.producto_repository.find(filtro)

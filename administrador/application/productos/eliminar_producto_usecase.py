from administrador.domain.productos.producto_repository_port import ProductoRepositoryPort

class EliminarProductoUseCase:
    def __init__(self, producto_repository: ProductoRepositoryPort):
        self.producto_repository = producto_repository

    def execute(self, id: int) -> None:
        self.producto_repository.delete(id)

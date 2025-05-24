from administrador.domain.productos.producto import Producto
from administrador.domain.productos.producto_repository_port import ProductoRepositoryPort


class ObtenerProductosConImagenesUseCase:
    def __init__(self, repo: ProductoRepositoryPort):
        self.repo = repo

    def execute(self):
        return self.repo.obtener_productos_con_imagenes()

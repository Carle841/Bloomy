from administrador.domain.productos.producto import Producto
from administrador.domain.productos.producto_repository_port import ProductoRepositoryPort

class CrearProductoUseCase:
    def __init__(self, producto_repository: ProductoRepositoryPort):
        self.producto_repository = producto_repository

    def execute(self, nombre: str, codigo: str, categoria_id: int, precio: float, stock: int, estado: bool, descripcion: str) -> int:
        producto_id = self.producto_repository.next_identity()

        producto = Producto(
            id=producto_id,
            nombre=nombre,
            codigo=codigo,
            categoria_id=categoria_id,
            precio=precio,
            stock=stock,
            estado=estado,
            descripcion=descripcion
        )

        self.producto_repository.store(producto)
        return producto_id

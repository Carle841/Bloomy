from administrador.domain.productos.producto import Producto
from administrador.domain.productos.producto_repository_port import ProductoRepositoryPort

class ActualizarProductoUseCase:
    def __init__(self, producto_repository: ProductoRepositoryPort):
        self.producto_repository = producto_repository

    def execute(self, id: int, nombre: str, codigo: str, categoria_id: int, precio: float, stock: int, estado: bool, descripcion: str) -> None:
        producto = self.producto_repository.get_by_id(id)
        if producto is None:
            raise ValueError("Producto no encontrado")

        producto_actualizado = Producto(
            id=id,
            nombre=nombre,
            codigo=codigo,
            categoria_id=categoria_id,
            precio=precio,
            stock=stock,
            estado=estado,
            descripcion=descripcion
        )

        self.producto_repository.store(producto_actualizado)

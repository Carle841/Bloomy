from administrador.domain.combos_productos.combos_productos import ComboProducto
from administrador.domain.combos_productos.combos_productos_repository_port import ComboProductoRepositoryPort
from administrador.domain.productos.producto_repository_port import ProductoRepositoryPort
from administrador.domain.combos.combo_repository_port import ComboRepositoryPort

class ComboProductoService:
    def __init__(
        self,
        combo_producto_repository: ComboProductoRepositoryPort,
        producto_repository: ProductoRepositoryPort,
        combo_repository: ComboRepositoryPort
    ):
        self.combo_producto_repository = combo_producto_repository
        self.producto_repository = producto_repository
        self.combo_repository = combo_repository

    def add(self, combo_producto: ComboProducto) -> None:
        # Validar existencia del combo
        if not self.combo_repository.get_by_id(combo_producto.get_combo_id()):
            raise ValueError("Combo no encontrado")

        # Obtener el producto para calcular el subtotal
        producto = self.producto_repository.get_by_id(combo_producto.get_producto_id())
        if not producto:
            raise ValueError("Producto no encontrado")

        # Calcular subtotal
        subtotal = combo_producto.get_cantidad() * producto.get_precio()
        combo_producto.set_subtotal(subtotal)

        # Guardar
        self.combo_producto_repository.store(combo_producto)

    def get_by_id(self, combo_id: int, producto_id: int) -> ComboProducto | None:
        return self.combo_producto_repository.get_by_id(combo_id, producto_id)

    def find_all(self, combo_id: int) -> list[ComboProducto]:
        return self.combo_producto_repository.find(combo_id)

    def remove(self, combo_id: int, producto_id: int) -> None:
        self.combo_producto_repository.delete(combo_id, producto_id)

    def update(self, combo_producto: ComboProducto) -> None:
        # Validar existencia del combo
        if not self.combo_repository.get_by_id(combo_producto.get_combo_id()):
            raise ValueError("Combo no encontrado")

        # Obtener el producto para recalcular el subtotal
        producto = self.producto_repository.get_by_id(combo_producto.get_producto_id())
        if not producto:
            raise ValueError("Producto no encontrado")

        # Recalcular subtotal
        subtotal = combo_producto.get_cantidad() * producto.get_precio()
        combo_producto.set_subtotal(subtotal)

        # Actualizar
        self.combo_producto_repository.store(combo_producto)

    def get_next_id(self) -> tuple[int, int]:
        return self.combo_producto_repository.next_identity()
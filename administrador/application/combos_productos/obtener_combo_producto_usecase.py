from administrador.domain.combos_productos.combos_productos import ComboProducto
from administrador.domain.combos_productos.combos_productos_repository_port import ComboProductoRepositoryPort

class ObtenerComboProductoUseCase:
    def __init__(self, combo_producto_repo: ComboProductoRepositoryPort):
        self.combo_producto_repo = combo_producto_repo

    def execute(self, combo_id: int, producto_id: int) -> ComboProducto:
        combo_producto = self.combo_producto_repo.get_by_id(combo_id, producto_id)
        if not combo_producto:
            raise Exception("ComboProducto no encontrado")
        return combo_producto
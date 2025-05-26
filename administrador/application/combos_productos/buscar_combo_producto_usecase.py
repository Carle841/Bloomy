from administrador.domain.combos_productos.combos_productos import ComboProducto
from administrador.domain.combos_productos.combos_productos_repository_port import ComboProductoRepositoryPort

class BuscarComboProductoUseCase:
    def __init__(self, combo_producto_repo: ComboProductoRepositoryPort):
        self.combo_producto_repo = combo_producto_repo

    def execute(self, combo_id: int) -> list[ComboProducto]:
        return self.combo_producto_repo.find(combo_id)
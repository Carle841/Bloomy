from administrador.domain.combos_productos.combos_productos import ComboProducto
from administrador.domain.combos_productos.combos_productos_repository_port import ComboProductoRepositoryPort
from administrador.domain.combos.combo_repository_port import ComboRepositoryPort

class EliminarComboProductoUseCase:
    def __init__(
        self,
        combo_producto_repo: ComboProductoRepositoryPort,
        combo_repo: ComboRepositoryPort
    ):
        self.combo_producto_repo = combo_producto_repo
        self.combo_repo = combo_repo

    def execute(self, combo_id: int, producto_id: int):
        # Validar existencia del ComboProducto
        combo_producto_existente = self.combo_producto_repo.get_by_id(combo_id, producto_id)
        if not combo_producto_existente:
            raise Exception("ComboProducto no encontrado")

        # Eliminar ComboProducto
        self.combo_producto_repo.delete(combo_id, producto_id)

        # Validar existencia del combo
        combo = self.combo_repo.get_by_id(combo_id)
        if not combo:
            return  # Combo ya no existe, no se actualizan precios

        # Calcular suma de subtotales
        combo_productos = self.combo_producto_repo.find(combo_id)
        precio_sin_descuento = sum(cp.get_subtotal() for cp in combo_productos)

        # Calcular precio con descuento
        descuento_porcentaje = combo.get_descuento_porcentaje()
        if not (0 <= descuento_porcentaje <= 100):
            raise Exception("Descuento porcentaje inválido")
        precio_con_descuento = precio_sin_descuento * (1 - descuento_porcentaje / 100)

        # Actualizar precios en tienda.combos
        self.combo_repo.update_precios(combo_id, precio_sin_descuento, precio_con_descuento)
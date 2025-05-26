from dataclasses import dataclass

@dataclass
class ComboProducto:
    def __init__(self, combo_id: int, producto_id: int, cantidad: int = 1, subtotal: float = 0.00):
        self._combo_id = combo_id
        self._producto_id = producto_id
        self._cantidad = cantidad
        self._subtotal = subtotal

    # Getters
    def get_combo_id(self) -> int:
        return self._combo_id

    def get_producto_id(self) -> int:
        return self._producto_id

    def get_cantidad(self) -> int:
        return self._cantidad

    def get_subtotal(self) -> float:
        return self._subtotal

    # Setters
    def set_cantidad(self, valor: int):
        if valor <= 0:
            raise ValueError("La cantidad debe ser mayor a 0")
        self._cantidad = valor

    def set_subtotal(self, valor: float):
        if valor < 0:
            raise ValueError("El subtotal no puede ser negativo")
        self._subtotal = valor
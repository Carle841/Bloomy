from decimal import Decimal
from typing import Optional

class DetalleVenta:
    def __init__(
        self,
        id: Optional[int],
        venta_id: int,
        producto_id: Optional[int],
        combo_id: Optional[int],
        cantidad: int,
        precio_unitario: Decimal
    ):
        self.id = id
        self.venta_id = venta_id
        self.producto_id = producto_id
        self.combo_id = combo_id
        self.cantidad = cantidad
        self.precio_unitario = precio_unitario

        if self.cantidad <= 0:
            raise ValueError("La cantidad debe ser mayor que 0")
        if self.precio_unitario < 0:
            raise ValueError("El precio unitario no puede ser negativo")
        if producto_id is None and combo_id is None:
            raise ValueError("Debe especificarse producto_id o combo_id")
        if producto_id is not None and combo_id is not None:
            raise ValueError("No se pueden especificar producto_id y combo_id simultáneamente")

    def get_id(self) -> Optional[int]:
        return self.id

    def get_venta_id(self) -> int:
        return self.venta_id

    def get_producto_id(self) -> Optional[int]:
        return self.producto_id

    def get_combo_id(self) -> Optional[int]:
        return self.combo_id

    def get_cantidad(self) -> int:
        return self.cantidad

    def get_precio_unitario(self) -> Decimal:
        return self.precio_unitario

    def get_subtotal(self) -> Decimal:
        return self.cantidad * self.precio_unitario
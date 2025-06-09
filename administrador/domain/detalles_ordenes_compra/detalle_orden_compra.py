from decimal import Decimal
from typing import Optional

class DetallesOrdenesCompra:
    def __init__(
        self,
        id: Optional[int],
        orden_compra_id: int,
        producto_id: int,
        cantidad: int,
        precio_unitario: Decimal
    ):
        self.id = id
        self.orden_compra_id = orden_compra_id
        self.producto_id = producto_id
        self.cantidad = cantidad
        self.precio_unitario = precio_unitario

        if self.cantidad <= 0:
            raise ValueError("La cantidad debe ser mayor que 0")
        if self.precio_unitario < 0:
            raise ValueError("El precio unitario no puede ser negativo")

    def get_id(self) -> Optional[int]:
        return self.id

    def get_orden_compra_id(self) -> int:
        return self.orden_compra_id

    def get_producto_id(self) -> int:
        return self.producto_id

    def get_cantidad(self) -> int:
        return self.cantidad

    def get_precio_unitario(self) -> Decimal:
        return self.precio_unitario

    def get_subtotal(self) -> Decimal:
        return self.cantidad * self.precio_unitario
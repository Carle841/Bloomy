from typing import List, Optional
from datetime import date
from decimal import Decimal

class ProductoAsociadoCombo:
    def __init__(
        self,
        nombre: str,
        cantidad: int,
        subtotal: Decimal
    ):
        self.nombre = nombre
        self.cantidad = cantidad
        self.subtotal = subtotal

class ProductoDetalle:
    def __init__(
        self,
        nombre: str,
        cantidad: int,
        precio_unitario: Decimal,
        subtotal: Decimal
    ):
        self.nombre = nombre
        self.cantidad = cantidad
        self.precio_unitario = precio_unitario
        self.subtotal = subtotal

class ComboDetalle:
    def __init__(
        self,
        nombre: str,
        cantidad: int,
        precio_unitario: Decimal,
        subtotal: Decimal,
        productos_asociados: List[ProductoAsociadoCombo]
    ):
        self.nombre = nombre
        self.cantidad = cantidad
        self.precio_unitario = precio_unitario
        self.subtotal = subtotal
        self.productos_asociados = productos_asociados

class VentaCompleta:
    def __init__(
        self,
        id: int,
        numero: str,
        cliente: str,
        estado: str,
        email: Optional[str],
        celular: Optional[str],
        fecha: date,
        direccion: Optional[str],
        observaciones: Optional[str],
        items: List[ProductoDetalle | ComboDetalle],
        total: Decimal
    ):
        self.id = id
        self.numero = numero
        self.cliente = cliente
        self.estado = estado
        self.email = email
        self.celular = celular
        self.fecha = fecha
        self.direccion = direccion
        self.observaciones = observaciones
        self.items = items
        self.total = total
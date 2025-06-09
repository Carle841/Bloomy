from datetime import date
from decimal import Decimal
from typing import Optional, List, Dict
from dataclasses import dataclass

@dataclass
class ProductoDetalle:
    producto: str
    cantidad: int
    precio_unitario: Decimal
    subtotal: Decimal

@dataclass
class OrdenCompraCompleta:
    id: int
    numero_orden: str
    proveedor: str
    estado: str
    contacto: Optional[str]
    celular: Optional[str]
    fecha_entrega: Optional[date]
    fecha_orden: date
    metodo_transferencia: Optional[str]
    productos: List[ProductoDetalle]
    total: Decimal
    notas: Optional[str]
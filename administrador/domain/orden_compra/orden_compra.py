from datetime import date
from decimal import Decimal
from typing import Optional

class OrdenCompra:
    def __init__(
        self,
        id: Optional[int],
        numero_orden: str,
        proveedor_id: int,
        fecha_orden: date,
        fecha_entrega_esperada: Optional[date],
        metodo_pago: Optional[str],
        notas: Optional[str],
        estado: str,
        total: Optional[Decimal],
        proveedor: Optional[str] = None,
        cantidad_productos: Optional[int] = None,
    ):
        self.id = id
        self.numero_orden = numero_orden
        self.proveedor_id = proveedor_id
        self.fecha_orden = fecha_orden
        self.fecha_entrega_esperada = fecha_entrega_esperada
        self.metodo_pago = metodo_pago
        self.notas = notas
        self.estado = estado
        self.total = total
        self.proveedor = proveedor
        self.cantidad_productos = cantidad_productos

        estados_validos = {'Pendiente', 'En tránsito', 'Recibido', 'Cancelado'}
        if estado not in estados_validos:
            raise ValueError(f"El estado debe ser uno de: {estados_validos}")
        if not numero_orden.startswith('COMP-') or not numero_orden[5:].isdigit() or len(numero_orden[5:]) != 4:
            raise ValueError("El número de orden debe tener el formato COMP-XXXX")

    def get_id(self) -> Optional[int]:
        return self.id

    def get_numero_orden(self) -> str:
        return self.numero_orden

    def get_proveedor_id(self) -> int:
        return self.proveedor_id

    def get_fecha_orden(self) -> date:
        return self.fecha_orden

    def get_fecha_entrega_esperada(self) -> Optional[date]:
        return self.fecha_entrega_esperada

    def get_metodo_pago(self) -> Optional[str]:
        return self.metodo_pago

    def get_notas(self) -> Optional[str]:
        return self.notas

    def get_estado(self) -> str:
        return self.estado

    def get_total(self) -> Optional[Decimal]:
        return self.total
    
    def get_proveedor(self) -> Optional[str]:
        return self.proveedor
    
    def get_cantidad_productos(self) -> Optional[int]:
        return self.cantidad_productos
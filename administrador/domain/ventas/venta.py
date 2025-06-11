from datetime import date
from decimal import Decimal
from typing import Optional

class Venta:
    def __init__(
        self,
        id: Optional[int],
        numero: str,
        fecha: date,
        cliente_id: int,
        total: Optional[Decimal],
        estado: str,
        direccion: Optional[str],
        observaciones: Optional[str],
        cliente: Optional[str] = None,
        cantidad_productos: Optional[int] = None,
    ):
        self.id = id
        self.numero = numero
        self.fecha = fecha
        self.cliente_id = cliente_id
        self.total = total
        self.estado = estado
        self.direccion = direccion
        self.observaciones = observaciones
        self.cliente = cliente
        self.cantidad_productos = cantidad_productos

        estados_validos = {'Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'}
        if estado not in estados_validos:
            raise ValueError(f"El estado debe ser uno de: {estados_validos}")
        if not numero.startswith('VEN-') or not numero[4:].isdigit() or len(numero[4:]) != 4:
            raise ValueError("El número de venta debe tener el formato VEN-XXXX")

    def get_id(self) -> Optional[int]:
        return self.id

    def get_numero(self) -> str:
        return self.numero

    def get_fecha(self) -> date:
        return self.fecha

    def get_cliente_id(self) -> int:
        return self.cliente_id

    def get_total(self) -> Optional[Decimal]:
        return self.total

    def get_estado(self) -> str:
        return self.estado

    def get_direccion(self) -> Optional[str]:
        return self.direccion

    def get_observaciones(self) -> Optional[str]:
        return self.observaciones

    def get_cliente(self) -> Optional[str]:
        return self.cliente

    def get_cantidad_productos(self) -> Optional[int]:
        return self.cantidad_productos
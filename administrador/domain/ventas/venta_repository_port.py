from typing import List, Optional
from datetime import date
from administrador.domain.ventas.venta import Venta
from administrador.domain.ventas.venta_completa import VentaCompleta

class VentaRepositoryPort:
    def get_by_id(self, id: int) -> Optional[Venta]:
        pass

    def store(self, venta: Venta) -> None:
        pass

    def delete(self, id: int) -> None:
        pass

    def next_identity(self) -> int:
        pass

    def find(self, busqueda: str) -> List[Venta]:
        pass

    def buscar_por_numero(self, numero: str) -> Optional[Venta]:
        pass

    def filtrar(
        self,
        estado: Optional[str],
        cliente_id: Optional[int],
        fecha_desde: Optional[date],
        fecha_hasta: Optional[date]
    ) -> List[Venta]:
        pass

    def contar_productos_venta(self, id: int) -> int:
        pass

    def buscar_venta_todo(self, id: int) -> Optional[VentaCompleta]:
        pass
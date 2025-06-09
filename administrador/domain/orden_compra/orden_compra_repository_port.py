from typing import List, Optional
from datetime import date
from administrador.domain.orden_compra.orden_compra import OrdenCompra
from administrador.domain.orden_compra.orden_compra_completa import OrdenCompraCompleta

class OrdenCompraRepositoryPort:
    def get_by_id(self, id: int) -> Optional[OrdenCompra]:
        pass

    def store(self, orden: OrdenCompra) -> None:
        pass

    def delete(self, id: int) -> None:
        pass

    def next_identity(self) -> int:
        pass

    def find(self, busqueda: str) -> List[OrdenCompra]:
        pass

    def buscar_por_numero_orden(self, numero_orden: str) -> Optional[OrdenCompra]:
        pass

    def filtrar(
        self,
        estado: Optional[str],
        proveedor_id: Optional[int],
        fecha_desde: Optional[date],
        fecha_hasta: Optional[date]
    ) -> List[OrdenCompra]:
        pass
    
    def buscar_compra_todo(self, id: int) -> Optional[OrdenCompraCompleta]:
        pass

    def contar_productos_orden(self, id: int) -> int:
        pass
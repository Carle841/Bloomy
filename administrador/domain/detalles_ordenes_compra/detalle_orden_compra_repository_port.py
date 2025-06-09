from typing import List, Optional
from administrador.domain.detalles_ordenes_compra.detalle_orden_compra import DetallesOrdenesCompra

class DetallesOrdenesCompraRepositoryPort:
    def store(self, detalle: DetallesOrdenesCompra) -> None:
        pass

    def find_by_orden_compra_id(self, orden_compra_id: int) -> List[DetallesOrdenesCompra]:
        pass

    def next_identity(self) -> int:
        pass

    def get_by_id(self, id: int) -> Optional[DetallesOrdenesCompra]:
        pass

    def delete(self, id: int) -> None:
        pass
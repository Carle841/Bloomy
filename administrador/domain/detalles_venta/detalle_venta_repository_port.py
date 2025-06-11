from typing import List, Optional
from administrador.domain.detalles_venta.detalle_venta import DetalleVenta

class DetalleVentaRepositoryPort:
    def store(self, detalle: DetalleVenta) -> None:
        pass

    def find_by_venta_id(self, venta_id: int) -> List[DetalleVenta]:
        pass

    def next_identity(self) -> int:
        pass

    def get_by_id(self, id: int) -> Optional[DetalleVenta]:
        pass

    def delete(self, id: int) -> None:
        pass
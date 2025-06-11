from typing import List
from administrador.domain.detalles_venta.detalle_venta import DetalleVenta
from administrador.domain.detalles_venta.detalle_venta_repository_port import DetalleVentaRepositoryPort

class ListarDetalleVentaUseCase:
    def __init__(self, repo: DetalleVentaRepositoryPort):
        self.repo = repo

    def execute(self, venta_id: int) -> List[DetalleVenta]:
        return self.repo.find_by_venta_id(venta_id)
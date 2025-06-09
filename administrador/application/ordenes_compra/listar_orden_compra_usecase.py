from administrador.domain.orden_compra.orden_compra_repository_port import OrdenCompraRepositoryPort
from typing import List, Optional
from datetime import date
from administrador.domain.orden_compra.orden_compra import OrdenCompra

class ListarOrdenCompraUseCase:
    def __init__(self, repo: OrdenCompraRepositoryPort):
        self.repo = repo

    def execute(
        self,
        estado: Optional[str],
        proveedor_id: Optional[int],
        fecha_desde: Optional[date],
        fecha_hasta: Optional[date]
    ) -> List[OrdenCompra]:
        return self.repo.filtrar(estado, proveedor_id, fecha_desde, fecha_hasta)
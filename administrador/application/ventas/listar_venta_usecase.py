from administrador.domain.ventas.venta_repository_port import VentaRepositoryPort
from typing import List, Optional
from datetime import date
from administrador.domain.ventas.venta import Venta

class ListarVentaUseCase:
    def __init__(self, repo: VentaRepositoryPort):
        self.repo = repo

    def execute(
        self,
        estado: Optional[str],
        cliente_id: Optional[int],
        fecha_desde: Optional[date],
        fecha_hasta: Optional[date]
    ) -> List[Venta]:
        return self.repo.filtrar(estado, cliente_id, fecha_desde, fecha_hasta)
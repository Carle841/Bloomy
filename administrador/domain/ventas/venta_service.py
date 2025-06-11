from typing import List, Optional
from datetime import date
from decimal import Decimal
from administrador.domain.ventas.venta import Venta
from administrador.domain.ventas.venta_repository_port import VentaRepositoryPort

class VentaService:
    def __init__(self, venta_repository: VentaRepositoryPort):
        self.venta_repository = venta_repository

    def add(self, venta: Venta) -> None:
        # Validar unicidad de numero
        if self.venta_repository.buscar_por_numero(venta.get_numero()):
            raise ValueError(f"El número de venta {venta.get_numero()} ya existe")
        self.venta_repository.store(venta)

    def get_by_id(self, id: int) -> Optional[Venta]:
        return self.venta_repository.get_by_id(id)

    def find_all(self, busqueda: str = "") -> List[Venta]:
        return self.venta_repository.find(busqueda)

    def remove(self, id: int) -> None:
        if not self.venta_repository.get_by_id(id):
            raise ValueError(f"La venta con ID {id} no existe")
        self.venta_repository.delete(id)

    def update(self, venta: Venta) -> None:
        if not venta.get_id():
            raise ValueError("La venta debe tener un ID para actualizar")
        if not self.venta_repository.get_by_id(venta.get_id()):
            raise ValueError(f"La venta con ID {venta.get_id()} no existe")
        # Validar unicidad de numero si cambió
        existing = self.venta_repository.buscar_por_numero(venta.get_numero())
        if existing and existing.get_id() != venta.get_id():
            raise ValueError(f"El número de venta {venta.get_numero()} ya existe")
        self.venta_repository.store(venta)

    def get_next_id(self) -> int:
        return self.venta_repository.next_identity()

    def filtrar(
        self,
        estado: Optional[str] = None,
        cliente_id: Optional[int] = None,
        fecha_desde: Optional[date] = None,
        fecha_hasta: Optional[date] = None
    ) -> List[Venta]:
        return self.venta_repository.filtrar(estado, cliente_id, fecha_desde, fecha_hasta)
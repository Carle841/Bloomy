from typing import List, Optional
from datetime import date
from decimal import Decimal
from administrador.domain.orden_compra.orden_compra import OrdenCompra
from administrador.domain.orden_compra.orden_compra_repository_port import OrdenCompraRepositoryPort

class OrdenCompraService:
    def __init__(self, orden_compra_repository: OrdenCompraRepositoryPort):
        self.orden_compra_repository = orden_compra_repository

    def add(self, orden: OrdenCompra) -> None:
        # Validar unicidad de numero_orden
        if self.orden_compra_repository.buscar_por_numero_orden(orden.get_numero_orden()):
            raise ValueError(f"El número de orden {orden.get_numero_orden()} ya existe")
        self.orden_compra_repository.store(orden)

    def get_by_id(self, id: int) -> Optional[OrdenCompra]:
        return self.orden_compra_repository.get_by_id(id)

    def find_all(self, busqueda: str = "") -> List[OrdenCompra]:
        return self.orden_compra_repository.find(busqueda)

    def remove(self, id: int) -> None:
        if not self.orden_compra_repository.get_by_id(id):
            raise ValueError(f"La orden con ID {id} no existe")
        self.orden_compra_repository.delete(id)

    def update(self, orden: OrdenCompra) -> None:
        if not orden.get_id():
            raise ValueError("La orden debe tener un ID para actualizar")
        if not self.orden_compra_repository.get_by_id(orden.get_id()):
            raise ValueError(f"La orden con ID {orden.get_id()} no existe")
        # Validar unicidad de numero_orden si cambió
        existing = self.orden_compra_repository.buscar_por_numero_orden(orden.get_numero_orden())
        if existing and existing.get_id() != orden.get_id():
            raise ValueError(f"El número de orden {orden.get_numero_orden()} ya existe")
        self.orden_compra_repository.store(orden)

    def get_next_id(self) -> int:
        return self.orden_compra_repository.next_identity()

    def filtrar(
        self,
        estado: Optional[str] = None,
        proveedor_id: Optional[int] = None,
        fecha_desde: Optional[date] = None,
        fecha_hasta: Optional[date] = None
    ) -> List[OrdenCompra]:
        return self.orden_compra_repository.filtrar(estado, proveedor_id, fecha_desde, fecha_hasta)
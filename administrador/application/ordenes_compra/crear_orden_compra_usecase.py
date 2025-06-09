from administrador.domain.orden_compra.orden_compra_repository_port import OrdenCompraRepositoryPort
from administrador.domain.orden_compra.orden_compra import OrdenCompra
from datetime import date
from typing import Optional
import random

class CrearOrdenCompraUseCase:
    def __init__(self, repo: OrdenCompraRepositoryPort):
        self.repo = repo

    def execute(
        self,
        proveedor_id: int,
        fecha_entrega_esperada: Optional[date],
        metodo_pago: Optional[str],
        notas: Optional[str]
    ) -> int:
        # Generar numero_orden único (COMP-XXXX)
        max_attempts = 10
        for _ in range(max_attempts):
            numero_orden = f"COMP-{random.randint(1000, 9999)}"
            if not self.repo.buscar_por_numero_orden(numero_orden):
                break
        else:
            raise ValueError("No se pudo generar un número de orden único")

        nuevo_id = self.repo.next_identity()
        orden = OrdenCompra(
            id=nuevo_id,
            numero_orden=numero_orden,
            proveedor_id=proveedor_id,
            fecha_orden=date.today(),
            fecha_entrega_esperada=fecha_entrega_esperada,
            metodo_pago=metodo_pago,
            notas=notas,
            estado="Pendiente",
            total=0.0  # Inicialmente el total es 0
        )
        self.repo.store(orden)
        return nuevo_id
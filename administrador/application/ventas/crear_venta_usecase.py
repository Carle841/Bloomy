from administrador.domain.ventas.venta_repository_port import VentaRepositoryPort
from administrador.domain.ventas.venta import Venta
from datetime import date
from typing import Optional
import random
from decimal import Decimal

class CrearVentaUseCase:
    def __init__(self, repo: VentaRepositoryPort):
        self.repo = repo

    def execute(
        self,
        cliente_id: int,
        direccion: Optional[str],
        observaciones: Optional[str]
    ) -> int:
        # Generar numero único (VEN-XXXX)
        max_attempts = 10
        for _ in range(max_attempts):
            numero = f"VEN-{random.randint(1000, 9999)}"
            if not self.repo.buscar_por_numero(numero):
                break
        else:
            raise ValueError("No se pudo generar un número de venta único")

        nuevo_id = self.repo.next_identity()
        venta = Venta(
            id=nuevo_id,
            numero=numero,
            fecha=date.today(),
            cliente_id=cliente_id,
            total=Decimal("0.00"),
            estado="Pendiente",
            direccion=direccion,
            observaciones=observaciones
        )
        self.repo.store(venta)
        return nuevo_id
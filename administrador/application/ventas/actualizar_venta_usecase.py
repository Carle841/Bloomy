from administrador.domain.ventas.venta_repository_port import VentaRepositoryPort
from administrador.domain.ventas.venta import Venta

class ActualizarVentaUseCase:
    def __init__(self, repo: VentaRepositoryPort):
        self.repo = repo

    def execute(self, id: int, estado: str) -> None:
        venta_existente = self.repo.get_by_id(id)
        if not venta_existente:
            raise Exception("Venta no encontrada")

        # Crear venta actualizada solo con el nuevo estado
        venta_actualizada = Venta(
            id=id,
            numero=venta_existente.get_numero(),
            fecha=venta_existente.get_fecha(),
            cliente_id=venta_existente.get_cliente_id(),
            total=venta_existente.get_total(),
            estado=estado,
            direccion=venta_existente.get_direccion(),
            observaciones=venta_existente.get_observaciones()
        )
        self.repo.store(venta_actualizada)
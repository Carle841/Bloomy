from administrador.domain.orden_compra.orden_compra_repository_port import OrdenCompraRepositoryPort
from administrador.domain.orden_compra.orden_compra import OrdenCompra

class ActualizarOrdenCompraUseCase:
    def __init__(self, repo: OrdenCompraRepositoryPort):
        self.repo = repo

    def execute(self, id: int, estado: str) -> None:
        orden_existente = self.repo.get_by_id(id)
        if not orden_existente:
            raise Exception("Orden de compra no encontrada")

        # Crear orden actualizada solo con el nuevo estado
        orden_actualizada = OrdenCompra(
            id=id,
            numero_orden=orden_existente.get_numero_orden(),
            proveedor_id=orden_existente.get_proveedor_id(),
            fecha_orden=orden_existente.get_fecha_orden(),
            fecha_entrega_esperada=orden_existente.get_fecha_entrega_esperada(),
            metodo_pago=orden_existente.get_metodo_pago(),
            notas=orden_existente.get_notas(),
            estado=estado,
            total=orden_existente.get_total()
        )
        self.repo.store(orden_actualizada)
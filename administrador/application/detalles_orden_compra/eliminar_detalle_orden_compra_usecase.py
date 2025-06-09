from administrador.domain.detalles_ordenes_compra.detalle_orden_compra_repository_port import DetallesOrdenesCompraRepositoryPort

class EliminarDetalleOrdenCompraUseCase:
    def __init__(self, repo: DetallesOrdenesCompraRepositoryPort):
        self.repo = repo

    def execute(self, id: int) -> None:
        if not self.repo.get_by_id(id):
            raise Exception("Detalle de orden de compra no encontrado")
        self.repo.delete(id)
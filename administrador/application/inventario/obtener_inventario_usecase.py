from administrador.domain.inventario.inventario_repository_port import InventarioRepositoryPort

class ObtenerInventarioUseCase:
    def __init__(self, repo: InventarioRepositoryPort):
        self.repo = repo

    def execute(self, id):
        inventario_existente = self.repo.get_by_id(id)
        if not inventario_existente:
            raise Exception("Inventario no encontrado")
        
        return inventario_existente

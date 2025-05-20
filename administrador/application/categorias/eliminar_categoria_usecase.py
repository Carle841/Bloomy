from administrador.domain.categorias.categoria_repository_port import CategoriaRepositoryPort

class EliminarCategoriaUseCase:
    def __init__(self, repo: CategoriaRepositoryPort):
        self.repo = repo

    def execute(self, id):
        self.repo.delete(id)

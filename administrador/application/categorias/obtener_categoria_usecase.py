from administrador.domain.categorias.categoria_repository_port import CategoriaRepositoryPort

class ObtenerCategoriaUseCase:
    def __init__(self, repo: CategoriaRepositoryPort):
        self.repo = repo

    def execute(self, id):
        return self.repo.get_by_id(id)

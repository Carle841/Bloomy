from administrador.domain.categorias.categoria_repository_port import CategoriaRepositoryPort

class BuscarCategoriaUseCase:
    def __init__(self, repo: CategoriaRepositoryPort):
        self.repo = repo

    def execute(self, filtro: str):
        return self.repo.find(filtro)

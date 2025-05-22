from administrador.domain.categorias.categoria_repository_port import CategoriaRepositoryPort
from administrador.domain.categorias.categoria import Categoria

class BuscarCategoriaDetalladaUseCase:
    def __init__(self, repo = CategoriaRepositoryPort):
        self.categoria_repository = repo

    def execute(self):
        return self.categoria_repository.find_with_details()

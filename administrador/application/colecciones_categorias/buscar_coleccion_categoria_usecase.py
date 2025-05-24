from administrador.domain.colecciones_categorias.coleccion_categoria_repository_port import ColeccionCategoriaRepositoryPort

class BuscarColeccionCategoriaUseCase:
    def __init__(self, repository = ColeccionCategoriaRepositoryPort):
        self.repository = repository

    def execute(self):
        return self.repository.find_all()
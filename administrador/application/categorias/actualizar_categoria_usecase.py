from administrador.domain.categorias.categoria_repository_port import CategoriaRepositoryPort
from administrador.domain.categorias.categoria import Categoria
from datetime import datetime

class ActualizarCategoriaUseCase:
    def __init__(self, repo: CategoriaRepositoryPort):
        self.repo = repo

    def execute(self, id, nombre, descripcion, icono_id, color_id):
        categoria = Categoria(
            id=id,
            nombre=nombre,
            descripcion=descripcion,
            icono_id=icono_id,
            color_id=color_id
        )
        self.repo.store(categoria)

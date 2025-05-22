from administrador.domain.categorias.categoria_repository_port import CategoriaRepositoryPort
from administrador.domain.categorias.categoria import Categoria
from datetime import datetime

class CrearCategoriaUseCase:
    def __init__(self, repo: CategoriaRepositoryPort):
        self.repo = repo

    def execute(self, nombre, descripcion, icono_id, color_id):
        nuevo_id = self.repo.next_identity()
        categoria = Categoria(
            id=nuevo_id,
            nombre=nombre,
            descripcion=descripcion,
            icono_id=icono_id,
            color_id=color_id
        )
        self.repo.store(categoria)
        return nuevo_id

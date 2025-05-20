from administrador.domain.categorias.categoria import Categoria
from administrador.domain.categorias.categoria_repository_port import CategoriaRepositoryPort

class CategoriaService:

    def __init__(self, categoria_repository: CategoriaRepositoryPort):
        self.categoria_repository = categoria_repository

    def add(self, categoria: Categoria) -> None:
        self.categoria_repository.store(categoria)

    def get_by_id(self, id: int) -> Categoria | None:
        return self.categoria_repository.get_by_id(id)

    def find_all(self, filtro: str) -> list:
        return self.categoria_repository.find(filtro=filtro)

    def remove(self, id: int) -> None:
        self.categoria_repository.delete(id)

    def update(self, categoria: Categoria) -> None:
        self.categoria_repository.store(categoria)

    def get_next_id(self) -> int:
        return self.categoria_repository.next_identity()

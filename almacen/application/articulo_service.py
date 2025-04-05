from almacen.domain.articulo import Articulo
from almacen.domain.articulos_port import ArticulosPort


class ArticulosService:

    def __init__(self, articulosPort: ArticulosPort):
        self.articulosPort = articulosPort

    def add(self, articulo: Articulo) -> None:
        self.articulosPort.save(articulo)

    def get_by_id(self, id: int) -> Articulo | None:
        return self.articulosPort.get_by_id(id)

    def find_all(self, filtro: str) -> list:
        return self.articulosPort.find_all(filtro=filtro)

    def remove(self, id: int) -> None:
        self.articulosPort.delete(id)

    def update(self, articulo: Articulo) -> None:
        self.articulosPort.save(articulo)

    def get_next_id(self) -> int:
        return self.articulosPort.get_next_id()

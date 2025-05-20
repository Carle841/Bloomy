from administrador.domain.colores.color import Color
from administrador.domain.colores.color_repository_port import ColorRepositoryPort

class ColorService:

    def __init__(self, color_repository: ColorRepositoryPort):
        self.color_repository = color_repository

    def add(self, color: Color) -> None:
        self.color_repository.store(color)

    def get_by_id(self, id: int) -> Color | None:
        return self.color_repository.get_by_id(id)

    def find_all(self, filtro: str) -> list[Color]:
        return self.color_repository.find(filtro)

    def remove(self, id: int) -> None:
        self.color_repository.delete(id)

    def update(self, color: Color) -> None:
        self.color_repository.store(color)

    def get_next_id(self) -> int:
        return self.color_repository.next_identity()

from administrador.domain.colores.color_repository_port import ColorRepositoryPort
from administrador.domain.colores.color import Color

class CrearColorUseCase:
    def __init__(self, repo: ColorRepositoryPort):
        self.repo = repo

    def execute(self, nombre: str, codigo_hex: str) -> Color:
        nuevo_id = self.repo.next_identity()
        color = Color(color_id=nuevo_id, nombre=nombre, codigo_hex=codigo_hex)
        self.repo.store(color)
        return nuevo_id

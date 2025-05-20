from administrador.domain.colores.color_repository_port import ColorRepositoryPort
from administrador.domain.colores.color import Color

class ActualizarColorUseCase:
    def __init__(self, repo: ColorRepositoryPort):
        self.repo = repo

    def execute(self, color_id: int, nombre: str, codigo_hex: str) -> Color:
        color_existente = self.repo.get_by_id(color_id)
        if color_existente is None:
            raise Exception("Color no encontrado")

        color_actualizado = Color(color_id=color_id, nombre=nombre, codigo_hex=codigo_hex)
        self.repo.store(color_actualizado)

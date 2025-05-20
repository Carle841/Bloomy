from administrador.domain.colores.color_repository_port import ColorRepositoryPort
from administrador.domain.colores.color import Color

class ObtenerColorUseCase:
    def __init__(self, repo: ColorRepositoryPort):
        self.repo = repo

    def execute(self, id: int) -> Color | None:
        return self.repo.get_by_id(id)

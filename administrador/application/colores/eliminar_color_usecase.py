from administrador.domain.colores.color_repository_port import ColorRepositoryPort

class EliminarColorUseCase:
    def __init__(self, repo: ColorRepositoryPort):
        self.repo = repo

    def execute(self, id: int) -> None:
        self.repo.delete(id)

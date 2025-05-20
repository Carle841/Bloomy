from administrador.domain.iconos.icono_repository_port import IconoRepositoryPort

class EliminarIconoUseCase:
    def __init__(self, repo: IconoRepositoryPort):
        self.repo = repo

    def execute(self, id: int):
        self.repo.delete(id)

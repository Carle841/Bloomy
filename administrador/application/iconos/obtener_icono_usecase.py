from administrador.domain.iconos.icono_repository_port import IconoRepositoryPort

class ObtenerIconoUseCase:
    def __init__(self, repo: IconoRepositoryPort):
        self.repo = repo

    def execute(self, id: int):
        return self.repo.get_by_id(id)

from administrador.domain.iconos.icono_repository_port import IconoRepositoryPort

class BuscarIconoUseCase:
    def __init__(self, repo: IconoRepositoryPort):
        self.repo = repo

    def execute(self, filtro: str):
        return self.repo.find(filtro)

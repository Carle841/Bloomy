from administrador.domain.iconos.icono import Icono
from administrador.domain.iconos.icono_repository_port import IconoRepositoryPort

class ActualizarIconoUseCase:
    def __init__(self, repo: IconoRepositoryPort):
        self.repo = repo

    def execute(self, id: int, nombre: str):
        icono = Icono(id, nombre)
        self.repo.store(icono)

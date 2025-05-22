from administrador.domain.iconos.icono import Icono
from administrador.domain.iconos.icono_repository_port import IconoRepositoryPort

class CrearIconoUseCase:
    def __init__(self, repo: IconoRepositoryPort):
        self.repo = repo

    def execute(self, nombre: str, url: str):
        nuevo_id = self.repo.next_identity()
        icono = Icono(nuevo_id, nombre, url)
        self.repo.store(icono)
        return nuevo_id

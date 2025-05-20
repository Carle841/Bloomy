from administrador.domain.iconos.icono import Icono
from administrador.domain.iconos.icono_repository_port import IconoRepositoryPort

class IconoService:

    def __init__(self, icono_repository: IconoRepositoryPort):
        self.icono_repository = icono_repository

    def add(self, icono: Icono) -> None:
        self.icono_repository.store(icono)

    def get_by_id(self, id: int) -> Icono | None:
        return self.icono_repository.get_by_id(id)

    def find_all(self, filtro: str) -> list[Icono]:
        return self.icono_repository.find(filtro)

    def remove(self, id: int) -> None:
        self.icono_repository.delete(id)

    def update(self, icono: Icono) -> None:
        self.icono_repository.store(icono)

    def get_next_id(self) -> int:
        return self.icono_repository.next_identity()

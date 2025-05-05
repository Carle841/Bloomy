from abc import ABC, abstractmethod
from administrador.domain.usuarios.usuarios import Usuario

class UsuarioRepositoryPort(ABC):
    @abstractmethod
    def get_by_id(self, id: int) -> Usuario | None:
        pass

    @abstractmethod
    def store(self, usuario: Usuario) -> None:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass

    @abstractmethod
    def next_identity(self) -> int:
        pass

    @abstractmethod
    def find(self, filtro: str) -> list[Usuario]:
        pass
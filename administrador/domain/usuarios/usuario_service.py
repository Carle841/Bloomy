from administrador.domain.usuarios.usuarios import Usuario
from administrador.domain.usuarios.usuarios_repository_port import UsuarioRepositoryPort


class UsuarioService:

    def __init__(self, usuario_repository: UsuarioRepositoryPort):
        self.usuario_repository = usuario_repository

    def add(self, usuario: Usuario) -> None:
        self.usuario_repository.store(usuario)

    def get_by_id(self, id: int) -> Usuario | None:
        return self.usuario_repository.get_by_id(id)

    def find_all(self, filtro: str) -> list[Usuario]:
        return self.usuario_repository.find(filtro)

    def remove(self, id: int) -> None:
        self.usuario_repository.delete(id)

    def update(self, usuario: Usuario) -> None:
        self.usuario_repository.store(usuario)

    def get_next_id(self) -> int:
        return self.usuario_repository.next_identity()

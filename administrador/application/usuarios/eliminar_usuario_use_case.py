from administrador.domain.usuarios.usuarios_repository_port import UsuarioRepositoryPort

class EliminarUsuarioUseCase:
    def __init__(self, repo: UsuarioRepositoryPort):
        self.repo = repo

    def execute(self, id):
        self.repo.delete(id)

from administrador.domain.usuarios.usuarios_repository_port import UsuarioRepositoryPort

class ContarUsuariosPorRolUseCase:
    def __init__(self, repo: UsuarioRepositoryPort):
        self.repo = repo

    def execute(self):
        return self.repo.count_by_roles()

from administrador.domain.usuarios.usuarios_repository_port import UsuarioRepositoryPort

class ObtenerUsuarioUseCase:
    def __init__(self, repo: UsuarioRepositoryPort):
        self.repo = repo

    def execute(self, id):
        return self.repo.get_by_id(id)

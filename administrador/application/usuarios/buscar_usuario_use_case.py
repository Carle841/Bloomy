from administrador.domain.usuarios.usuarios_repository_port import UsuarioRepositoryPort

class BuscarUsuariosUseCase:
    def __init__(self, repo: UsuarioRepositoryPort):
        self.repo = repo

    def execute(self, filtro: str):
        return self.repo.find(filtro)

from administrador.domain.usuarios.usuarios_repository_port import UsuarioRepositoryPort

class EliminarUsuarioUseCase:
    def __init__(self, repo: UsuarioRepositoryPort):
        self.repo = repo

    def execute(self, id):
        usuario_existente = self.repo.get_by_id(id)
        if not usuario_existente:
            raise Exception("Usuario no encontrado")
        
        self.repo.delete(id)

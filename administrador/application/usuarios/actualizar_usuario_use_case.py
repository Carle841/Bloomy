from administrador.domain.usuarios.usuarios_repository_port import UsuarioRepositoryPort
from administrador.domain.usuarios.usuarios import Usuario
from datetime import datetime

class ActualizarUsuarioUseCase:
    def __init__(self, repo: UsuarioRepositoryPort):
        self.repo = repo

    def execute(self, id, nombre, email, id_rol, estado, telefono, contraseña):
        usuario = Usuario(
            id=id,
            nombre=nombre,
            email=email,
            rol=id_rol,
            estado=estado,
            ultimo_acceso=datetime.now(),
            telefono=telefono,
            contraseña=contraseña
        )
        self.repo.store(usuario)

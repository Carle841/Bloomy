from administrador.domain.usuarios.usuarios_repository_port import UsuarioRepositoryPort
from administrador.domain.usuarios.usuarios import Usuario
from datetime import datetime

class CrearUsuarioUseCase:
    def __init__(self, repo: UsuarioRepositoryPort):
        self.repo = repo

    def execute(self, nombre, email, id_rol, estado, telefono, contraseña):
        nuevo_id = self.repo.next_identity()
        usuario = Usuario(
            id=nuevo_id,
            nombre=nombre,
            email=email,
            id_rol=id_rol,  # nombre del rol
            estado=estado,
            ultimo_acceso=datetime.now(),
            fecha_registro=datetime.now(),
            telefono=telefono,
            contraseña=contraseña
        )
        self.repo.store(usuario)
        return nuevo_id

from administrador.domain.usuarios.usuarios_repository_port import UsuarioRepositoryPort
from administrador.domain.usuarios.usuarios import Usuario
from datetime import datetime

class ActualizarUsuarioUseCase:
    def __init__(self, repo: UsuarioRepositoryPort):
        self.repo = repo

    def execute(self, id, nombre, email, id_rol, estado, telefono, contraseña):
        usuario_existente = self.repo.get_by_id(id)
        if not usuario_existente:
            raise Exception("Usuario no encontrado")
        
        usuario_actualizado = Usuario(
            id=id,
            nombre=nombre,
            email=email,
            id_rol=id_rol,
            estado=estado,
            ultimo_acceso=datetime.now(),
            fecha_registro=usuario_existente.get_fecha_registro(),
            telefono=telefono,
            contraseña=contraseña
        )
        self.repo.store(usuario_actualizado)

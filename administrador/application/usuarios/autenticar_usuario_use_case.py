from administrador.domain.usuarios.usuarios_repository_port import UsuarioRepositoryPort
from datetime import datetime

class AutenticarUsuarioUseCase:
    def __init__(self, repo: UsuarioRepositoryPort):
        self.repo = repo

    def execute(self, email: str, contraseña: str) -> dict:
        usuarios = self.repo.find(email)
        usuario = next((u for u in usuarios if u.get_email().lower() == email.lower()), None)
        
        if not usuario:
            raise Exception("Usuario no encontrado")
        
        if usuario.get_estado() != 'activo':
            raise Exception("Usuario inactivo. Contacte al administrador")
        
        if usuario.get_contraseña() != contraseña:
            raise Exception("Contraseña incorrecta")
        
        usuario.set_ultimo_acceso(datetime.utcnow())
        self.repo.store(usuario)
        
        return {
            'user': {
                'id': usuario.get_id(),
                'nombre': usuario.get_nombre(),
                'id_rol': usuario.get_rol()
            }
        }
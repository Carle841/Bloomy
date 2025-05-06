from administrador.domain.usuarios.usuarios import Usuario
from administrador.domain.usuarios.usuarios_repository_port import UsuarioRepositoryPort
from administrador.infrastructure.pg_command import PGCommand
from datetime import datetime

class UsuarioRepositoryPgImpl(UsuarioRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Usuario | None:
        fila = self.db.queryone(
            """
            SELECT id, nombre, email, id_rol, estado, 
                   ultimo_acceso, fecha_registro, telefono, contraseña
            FROM tienda.usuarios
            WHERE id = %(id)s
            """,
            {"id": id}
        )
        if fila:
            return Usuario(
                id=fila["id"],
                nombre=fila["nombre"],
                email=fila["email"],
                id_rol=fila["id_rol"],
                estado=fila["estado"],
                ultimo_acceso=fila["ultimo_acceso"],
                fecha_registro=fila["fecha_registro"],
                telefono=fila["telefono"],
                contraseña=fila["contraseña"]
            )
        return None

    def store(self, usuario: Usuario) -> None:
        sql = """
        INSERT INTO tienda.usuarios (
            id, nombre, email, id_rol, estado, 
            ultimo_acceso, fecha_registro, telefono, contraseña
        )
        VALUES (
            %(id)s, %(nombre)s, %(email)s, %(id_rol)s, %(estado)s, 
            %(ultimo_acceso)s, %(fecha_registro)s, %(telefono)s, %(contraseña)s
        )
        ON CONFLICT (id) DO UPDATE 
        SET nombre = EXCLUDED.nombre, 
            email = EXCLUDED.email,
            id_rol = EXCLUDED.id_rol,
            estado = EXCLUDED.estado,
            ultimo_acceso = EXCLUDED.ultimo_acceso,
            fecha_registro = EXCLUDED.fecha_registro,
            telefono = EXCLUDED.telefono,
            contraseña = EXCLUDED.contraseña
        """
        self.db.execute(sql, {
            "id": usuario.get_id(),
            "nombre": usuario.get_nombre(),
            "email": usuario.get_email(),
            "id_rol": usuario.get_rol(),  # ahora es un número
            "estado": usuario.get_estado(),
            "ultimo_acceso": usuario.get_ultimo_acceso(),
            "fecha_registro": usuario.get_fecha_registro(),
            "telefono": usuario.get_telefono(),
            "contraseña": usuario.get_contraseña()
        })

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.usuarios WHERE id = %(id)s", {"id": id})

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.usuarios_id_seq') as id", {})
        return fila["id"]

    def find(self, filtro: str) -> list[Usuario]:
        filas = self.db.queryall(
            """
            SELECT id, nombre, email, id_rol, estado, 
                   ultimo_acceso, fecha_registro, telefono, contraseña
            FROM tienda.usuarios
            WHERE nombre ILIKE %(filtro)s OR email ILIKE %(filtro)s
            """,
            {"filtro": f"%{filtro}%"}
        )
        return [
            Usuario(
                id=f["id"],
                nombre=f["nombre"],
                email=f["email"],
                id_rol=f["id_rol"],
                estado=f["estado"],
                ultimo_acceso=f["ultimo_acceso"],
                fecha_registro=f["fecha_registro"],
                telefono=f["telefono"],
                contraseña=f["contraseña"]
            ) for f in filas
        ]

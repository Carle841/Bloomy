from administrador.domain.usuarios.usuarios import Usuario
from administrador.domain.usuarios.usuarios_repository_port import UsuarioRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class UsuarioRepositoryPgImpl(UsuarioRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Usuario | None:
        fila = self.db.queryone(
            "SELECT id, nombre, email, rol, estado FROM tienda.usuarios WHERE id = %(id)s",
            {"id": id}
        )
        if fila:
            return Usuario(
                fila["id"], fila["nombre"], fila["email"], fila["rol"], fila["estado"]
            )
        return None

    def store(self, usuario: Usuario) -> None:
        self.db.execute(
            """
            INSERT INTO tienda.usuarios (id, nombre, email, rol, estado)
            VALUES (%(id)s, %(nombre)s, %(email)s, %(rol)s, %(estado)s)
            ON CONFLICT (id) DO UPDATE 
            SET nombre = EXCLUDED.nombre, 
                email = EXCLUDED.email,
                rol = EXCLUDED.rol,
                estado = EXCLUDED.estado
            """,
            {
                "id": usuario.get_id(),
                "nombre": usuario.get_nombre(),
                "email": usuario.get_email(),
                "rol": usuario.get_rol(),
                "estado": usuario.get_estado()
            }
        )

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.usuarios WHERE id = %(id)s", {"id": id})

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.usuarios_id_seq') as id", {})
        return fila["id"]

    def find(self, filtro: str) -> list[Usuario]:
        filas = self.db.queryall(
            "SELECT id, nombre, email, rol, estado FROM tienda.usuarios WHERE nombre ILIKE %(filtro)s OR email ILIKE %(filtro)s",
            {"filtro": f"%{filtro}%"}
        )
        return [
            Usuario(f["id"], f["nombre"], f["email"], f["rol"], f["estado"]) 
            for f in filas
        ]
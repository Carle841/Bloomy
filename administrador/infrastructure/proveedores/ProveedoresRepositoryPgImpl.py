from administrador.domain.proveedores.proveedor import Proveedor
from administrador.domain.proveedores.proveedor_repository_port import ProveedorRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class ProveedoresRepositoryPgImpl(ProveedorRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Proveedor | None:
        fila = self.db.queryone("""
            SELECT id, nombre, contacto, telefono, email, direccion
            FROM tienda.proveedores
            WHERE id = %(id)s
        """, {"id": id})

        if fila:
            return Proveedor(
                id=fila["id"],
                nombre=fila["nombre"],
                contacto=fila["contacto"],
                telefono=fila["telefono"],
                email=fila["email"],
                direccion=fila["direccion"]
            )
        return None

    def store(self, proveedor: Proveedor) -> None:
        sql = """
        INSERT INTO tienda.proveedores (
            id, nombre, contacto, telefono, email, direccion
        ) VALUES (
            %(id)s, %(nombre)s, %(contacto)s, %(telefono)s, %(email)s, %(direccion)s
        )
        ON CONFLICT (id) DO UPDATE 
        SET nombre = EXCLUDED.nombre,
            contacto = EXCLUDED.contacto,
            telefono = EXCLUDED.telefono,
            email = EXCLUDED.email,
            direccion = EXCLUDED.direccion
        """
        self.db.execute(sql, {
            "id": proveedor.get_id(),
            "nombre": proveedor.get_nombre(),
            "contacto": proveedor.get_contacto(),
            "telefono": proveedor.get_telefono(),
            "email": proveedor.get_email(),
            "direccion": proveedor.get_direccion()
        })

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.proveedores WHERE id = %(id)s", {"id": id})

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.proveedores_id_seq') AS id", {})
        return fila["id"]

    def find(self, filtro: str) -> list[Proveedor]:
        filas = self.db.queryall("""
            SELECT id, nombre, contacto, telefono, email, direccion
            FROM tienda.proveedores
            WHERE nombre ILIKE %(filtro)s OR contacto ILIKE %(filtro)s OR email ILIKE %(filtro)s
        """, {"filtro": f"%{filtro}%"})

        return [
            Proveedor(
                id=f["id"],
                nombre=f["nombre"],
                contacto=f["contacto"],
                telefono=f["telefono"],
                email=f["email"],
                direccion=f["direccion"]
            ) for f in filas
        ]

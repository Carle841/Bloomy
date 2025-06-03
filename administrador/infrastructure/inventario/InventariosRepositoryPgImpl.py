from administrador.domain.inventario.inventario import Inventario
from administrador.domain.inventario.inventario_repository_port import InventarioRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class InventariosRepositoryPgImpl(InventarioRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Inventario | None:
        fila = self.db.queryone("""
            SELECT id, nombre, descripcion, precio, proveedor_id
            FROM tienda.inventario
            WHERE id = %(id)s
        """, {"id": id})

        if fila:
            return Inventario(
                id=fila["id"],
                nombre=fila["nombre"],
                descripcion=fila["descripcion"],
                precio=fila["precio"],
                proveedor_id=fila["proveedor_id"]
            )
        return None

    def store(self, inventario: Inventario) -> None:
        sql = """
        INSERT INTO tienda.inventario (
            id, nombre, descripcion, precio, proveedor_id
        ) VALUES (
            %(id)s, %(nombre)s, %(descripcion)s, %(precio)s, %(proveedor_id)s
        )
        ON CONFLICT (id) DO UPDATE 
        SET nombre = EXCLUDED.nombre,
            descripcion = EXCLUDED.descripcion,
            precio = EXCLUDED.precio,
            proveedor_id = EXCLUDED.proveedor_id
        """
        self.db.execute(sql, {
            "id": inventario.get_id(),
            "nombre": inventario.get_nombre(),
            "descripcion": inventario.get_descripcion(),
            "precio": inventario.get_precio(),
            "proveedor_id": inventario.get_proveedor_id()
        })

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.inventario WHERE id = %(id)s", {"id": id})

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.inventario_id_seq') AS id", {})
        return fila["id"]

    def find(self, filtro: str) -> list[Inventario]:
        filas = self.db.queryall("""
            SELECT id, nombre, descripcion, precio, proveedor_id
            FROM tienda.inventario
            WHERE nombre ILIKE %(filtro)s OR descripcion ILIKE %(filtro)s
        """, {"filtro": f"%{filtro}%"})

        return [
            Inventario(
                id=f["id"],
                nombre=f["nombre"],
                descripcion=f["descripcion"],
                precio=f["precio"],
                proveedor_id=f["proveedor_id"]
            ) for f in filas
        ]
        
    def find_by_proveedor(self, proveedor_id: int) -> list[Inventario]:
        filas = self.db.queryall("""
            SELECT id, nombre, descripcion, precio, proveedor_id
            FROM tienda.inventario
            WHERE proveedor_id = %(proveedor_id)s
        """, {"proveedor_id": proveedor_id})

        return [
            Inventario(
                id=f["id"],
                nombre=f["nombre"],
                descripcion=f["descripcion"],
                precio=f["precio"],
                proveedor_id=f["proveedor_id"]
            ) for f in filas
        ]

    

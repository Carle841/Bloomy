from administrador.domain.colecciones.coleccion import Coleccion
from administrador.domain.colecciones.coleccion_repository_port import ColeccionRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class ColeccionRepositoryPgImpl(ColeccionRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Coleccion | None:
        fila = self.db.queryone("""
            SELECT id, nombre, descripcion, imagen_url, estado, fecha_creacion
            FROM tienda.colecciones
            WHERE id = %(id)s
        """, {"id": id})
        if fila:
            return Coleccion(
                id=fila["id"],
                nombre=fila["nombre"],
                descripcion=fila["descripcion"],
                imagen_url=fila["imagen_url"],
                estado=fila["estado"],
                fecha_creacion=fila["fecha_creacion"]
            )
        return None

    def store(self, coleccion: Coleccion) -> None:
        sql = """
        INSERT INTO tienda.colecciones (id, nombre, descripcion, imagen_url, estado, fecha_creacion)
        VALUES (%(id)s, %(nombre)s, %(descripcion)s, %(imagen_url)s, %(estado)s, %(fecha_creacion)s)
        ON CONFLICT (id) DO UPDATE SET
            nombre = EXCLUDED.nombre,
            descripcion = EXCLUDED.descripcion,
            imagen_url = EXCLUDED.imagen_url,
            estado = EXCLUDED.estado
        """
        self.db.execute(sql, {
            "id": coleccion.get_id(),
            "nombre": coleccion.get_nombre(),
            "descripcion": coleccion.get_descripcion(),
            "imagen_url": coleccion.get_imagen_url(),
            "estado": coleccion.get_estado(),
            "fecha_creacion": coleccion.get_fecha_creacion()
        })

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.colecciones WHERE id = %(id)s", {"id": id})

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.colecciones_id_seq') as id", {})
        return fila["id"]

    def find(self, filtro: str) -> list[Coleccion]:
        filas = self.db.queryall("""
            SELECT id, nombre, descripcion, imagen_url, estado, fecha_creacion
            FROM tienda.colecciones
            WHERE nombre ILIKE %(filtro)s
        """, {"filtro": f"%{filtro}%"})
        return [
            Coleccion(
                id=f["id"],
                nombre=f["nombre"],
                descripcion=f["descripcion"],
                imagen_url=f["imagen_url"],
                estado=f["estado"],
                fecha_creacion=f["fecha_creacion"]
            ) for f in filas
        ]

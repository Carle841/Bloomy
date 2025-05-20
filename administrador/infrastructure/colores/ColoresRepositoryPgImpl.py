from administrador.domain.colores.color import Color
from administrador.domain.colores.color_repository_port import ColorRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class ColorRepositoryPgImpl(ColorRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Color | None:
        fila = self.db.queryone("""
            SELECT color_id, nombre, codigo_hex
            FROM tienda.colores
            WHERE color_id = %(color_id)s
        """, {"color_id": id})
        if fila:
            return Color(fila["color_id"], fila["nombre"], fila["codigo_hex"])
        return None

    def store(self, color: Color) -> None:
        sql = """
        INSERT INTO tienda.colores (color_id, nombre, codigo_hex)
        VALUES (%(color_id)s, %(nombre)s, %(codigo_hex)s)
        ON CONFLICT (color_id) DO UPDATE SET
            nombre = EXCLUDED.nombre,
            codigo_hex = EXCLUDED.codigo_hex
        """
        self.db.execute(sql, {
            "color_id": color.get_id(),
            "nombre": color.get_nombre(),
            "codigo_hex": color.get_codigo_hex()
        })

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.colores WHERE color_id = %(color_id)s", {"color_id": id})

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.colores_id_seq') as color_id", {})
        return fila["color_id"]

    def find(self, filtro: str) -> list[Color]:
        filas = self.db.queryall("""
            SELECT color_id, nombre, codigo_hex
            FROM tienda.colores
            WHERE nombre ILIKE %(filtro)s
        """, {"filtro": f"%{filtro}%"})
        return [Color(f["color_id"], f["nombre"], f["codigo_hex"]) for f in filas]


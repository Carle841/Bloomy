from administrador.domain.categorias.categoria import Categoria
from administrador.domain.categorias.categoria_repository_port import CategoriaRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class CategoriaRepositoryPgImpl(CategoriaRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Categoria | None:
        fila = self.db.queryone("""
            SELECT id, nombre, descripcion, icono_id, color_id
            FROM tienda.categorias
            WHERE id = %(id)s
        """, {"id": id})
        if fila:
            return Categoria(
                id=fila["id"],
                nombre=fila["nombre"],
                descripcion=fila["descripcion"],
                icono_id=fila["icono_id"],
                color_id=fila["color_id"]
            )
        return None

    def store(self, categoria: Categoria) -> None:
        sql = """
        INSERT INTO tienda.categorias (id, nombre, descripcion, icono_id, color_id)
        VALUES (%(id)s, %(nombre)s, %(descripcion)s, %(icono_id)s, %(color_id)s)
        ON CONFLICT (id) DO UPDATE SET
            nombre = EXCLUDED.nombre,
            descripcion = EXCLUDED.descripcion,
            icono_id = EXCLUDED.icono_id,
            color_id = EXCLUDED.color_id
        """
        self.db.execute(sql, {
            "id": categoria.get_id(),
            "nombre": categoria.get_nombre(),
            "descripcion": categoria.get_descripcion(),
            "icono_id": categoria.get_icono_id(),
            "color_id": categoria.get_color_id()
        })

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.categorias WHERE id = %(id)s", {"id": id})

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.categorias_id_seq') as id", {})
        return fila["id"]

    def find(self, filtro: str) -> list[Categoria]:
        filas = self.db.queryall("""
            SELECT id, nombre, descripcion, icono_id, color_id
            FROM tienda.categorias
            WHERE nombre ILIKE %(filtro)s OR descripcion ILIKE %(filtro)s
        """, {"filtro": f"%{filtro}%"})
        return [
            Categoria(
                id=f["id"],
                nombre=f["nombre"],
                descripcion=f["descripcion"],
                icono_id=f["icono_id"],
                color_id=f["color_id"]
            ) for f in filas
        ]

    def find_with_details(self) -> list[dict]:
        sql = """
            SELECT 
            c.id,
            c.nombre,
            c.descripcion,
            i.icono_id,
            i.url AS icono,
            col.color_id,
            col.codigo_hex AS color,
            c.fecha_creacion,
            COUNT(p.id) AS cantidad_productos
            FROM tienda.categorias c
            JOIN tienda.iconos i ON c.icono_id = i.icono_id
            JOIN tienda.colores col ON c.color_id = col.color_id
            LEFT JOIN tienda.productos p ON p.categoria_id = c.id
            GROUP BY c.id, c.nombre, i.icono_id, i.url, col.color_id, col.codigo_hex, c.fecha_creacion
        """
        filas = self.db.queryall(sql, {})
        return filas

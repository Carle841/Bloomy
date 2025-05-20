from administrador.domain.categorias.categoria import Categoria
from administrador.domain.categorias.categoria_repository_port import CategoriaRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class CategoriaRepositoryPgImpl(CategoriaRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Categoria | None:
        fila = self.db.queryone("""
            SELECT id, nombre, descripcion, estado, icono_id, color_id
            FROM tienda.categorias
            WHERE id = %(id)s
        """, {"id": id})
        if fila:
            return Categoria(
                id=fila["id"],
                nombre=fila["nombre"],
                descripcion=fila["descripcion"],
                estado=fila["estado"],
                icono_id=fila["icono_id"],
                color_id=fila["color_id"]
            )
        return None

    def store(self, categoria: Categoria) -> None:
        sql = """
        INSERT INTO tienda.categorias (id, nombre, descripcion, estado, icono_id, color_id)
        VALUES (%(id)s, %(nombre)s, %(descripcion)s, %(estado)s, %(icono_id)s, %(color_id)s)
        ON CONFLICT (id) DO UPDATE SET
            nombre = EXCLUDED.nombre,
            descripcion = EXCLUDED.descripcion,
            estado = EXCLUDED.estado,
            icono_id = EXCLUDED.icono_id,
            color_id = EXCLUDED.color_id
        """
        self.db.execute(sql, {
            "id": categoria.get_id(),
            "nombre": categoria.get_nombre(),
            "descripcion": categoria.get_descripcion(),
            "estado": categoria.get_estado(),
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
            SELECT id, nombre, descripcion, estado, icono_id, color_id
            FROM tienda.categorias
            WHERE nombre ILIKE %(filtro)s OR descripcion ILIKE %(filtro)s
        """, {"filtro": f"%{filtro}%"})
        return [
            Categoria(
                id=f["id"],
                nombre=f["nombre"],
                descripcion=f["descripcion"],
                estado=f["estado"],
                icono_id=f["icono_id"],
                color_id=f["color_id"]
            ) for f in filas
        ]

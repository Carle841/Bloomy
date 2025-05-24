from administrador.domain.colecciones_categorias.coleccion_categoria import ColeccionCategoria
from administrador.domain.colecciones_categorias.coleccion_categoria_repository_port import ColeccionCategoriaRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class ColeccionCategoriaRepositoryPgImpl(ColeccionCategoriaRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def add(self, coleccion_categoria: ColeccionCategoria) -> None:
        self.db.execute("""
            INSERT INTO tienda.colecciones_categorias (coleccion_id, categoria_id)
            VALUES (%(coleccion_id)s, %(categoria_id)s)
            ON CONFLICT DO NOTHING
        """, {
            "coleccion_id": coleccion_categoria.get_coleccion_id(),
            "categoria_id": coleccion_categoria.get_categoria_id()
        })

    def delete(self, coleccion_id: int, categoria_id: int) -> None:
        self.db.execute("""
            DELETE FROM tienda.colecciones_categorias
            WHERE coleccion_id = %(coleccion_id)s AND categoria_id = %(categoria_id)s
        """, {
            "coleccion_id": coleccion_id,
            "categoria_id": categoria_id
        })

    def find_all(self) -> list[ColeccionCategoria]:
        rows = self.db.queryall("""
            SELECT coleccion_id, categoria_id
            FROM tienda.colecciones_categorias
        """, {})
        return [ColeccionCategoria(r["coleccion_id"], r["categoria_id"]) for r in rows]

    def find_by_coleccion(self, coleccion_id: int) -> list[dict]:
        rows = self.db.queryall("""
            SELECT cc.coleccion_id, cc.categoria_id, c.nombre AS categoria_nombre
            FROM tienda.colecciones_categorias cc
            JOIN tienda.categorias c ON cc.categoria_id = c.id
            WHERE cc.coleccion_id = %(coleccion_id)s
        """, {"coleccion_id": coleccion_id})
        
        return [
            {
                "coleccion_id": r["coleccion_id"],
                "categoria_id": r["categoria_id"],
                "categoria_nombre": r["categoria_nombre"]
            }
            for r in rows
        ]

    def count_categorias_by_coleccion(self, coleccion_id: int) -> int:
        row = self.db.queryone("""
            SELECT COUNT(*) AS total_categorias
            FROM tienda.colecciones_categorias
            WHERE coleccion_id = %(coleccion_id)s
        """, {"coleccion_id": coleccion_id})

        return row["total_categorias"]

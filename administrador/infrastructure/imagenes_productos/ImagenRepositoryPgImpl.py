from administrador.domain.imagen_producto.imagen import Imagen
from administrador.domain.imagen_producto.imagen_repository_port import ImagenRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class ImagenRepositoryPgImpl(ImagenRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.imagenes_id_seq') as id", {})
        return fila["id"]

    def store(self, imagen: Imagen) -> None:
        sql = """
        INSERT INTO tienda.imagenes (id, producto_id, url, descripcion)
        VALUES (%(id)s, %(producto_id)s, %(url)s, %(descripcion)s)
        ON CONFLICT (id) DO UPDATE SET
            producto_id = EXCLUDED.producto_id,
            url = EXCLUDED.url,
            descripcion = EXCLUDED.descripcion
        """
        self.db.execute(sql, {
            "id": imagen.get_id(),
            "producto_id": imagen.get_producto_id(),
            "url": imagen.get_url(),
            "descripcion": imagen.get_descripcion()
        })

    def get_by_id(self, id: int) -> Imagen | None:
        fila = self.db.queryone("""
            SELECT id, producto_id, url, descripcion
            FROM tienda.imagenes
            WHERE id = %(id)s
        """, {"id": id})
        if fila:
            return Imagen(
                id=fila["id"],
                producto_id=fila["producto_id"],
                url=fila["url"], 
                descripcion=fila["descripcion"]
            )
        return None

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.imagenes WHERE id = %(id)s", {"id": id})

    def find(self, filtro: str) -> list[Imagen]:
        filas = self.db.queryall("""
            SELECT id, producto_id, url, descripcion
            FROM tienda.imagenes
            WHERE url ILIKE %(filtro)s
        """, {"filtro": f"%{filtro}%"})
        return [
            Imagen(
                f["id"],
                f["producto_id"],
                f["url"],
                f["descripcion"]
            ) for f in filas
        ]

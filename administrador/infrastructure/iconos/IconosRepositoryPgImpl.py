from administrador.domain.iconos.icono import Icono
from administrador.domain.iconos.icono_repository_port import IconoRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class IconoRepositoryPgImpl(IconoRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Icono | None:
        fila = self.db.queryone("""
            SELECT icono_id, nombre, url
            FROM tienda.iconos
            WHERE icono_id = %(icono_id)s
        """, {"icono_id": id})
        if fila:
            return Icono(fila["icono_id"], fila["nombre"], fila["url"])
        return None

    def store(self, icono: Icono) -> None:
        sql = """
        INSERT INTO tienda.iconos (icono_id, nombre, url)
        VALUES (%(icono_id)s, %(nombre)s, %(url)s)
        ON CONFLICT (icono_id) DO UPDATE SET
            nombre = EXCLUDED.nombre,
            url = EXCLUDED.url
        """
        self.db.execute(sql, {
            "icono_id": icono.get_id(),
            "nombre": icono.get_nombre(),
            "url": icono.get_url()
        })

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.iconos WHERE icono_id = %(icono_id)s", {"icono_id": id})

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.iconos_icono_id_seq') as icono_id", {})
        return fila["icono_id"]

    def find(self, filtro: str) -> list[Icono]:
        filas = self.db.queryall("""
            SELECT icono_id, nombre, url
            FROM tienda.iconos
            WHERE nombre ILIKE %(filtro)s
        """, {"filtro": f"%{filtro}%"})
        return [Icono(f["icono_id"], f["nombre"], f["url"]) for f in filas]

from almacen.domain.articulos_port import ArticulosPort
from almacen.domain.articulo import Articulo
from almacen import *
from almacen.helpers.pg_command import PGCommand


class ArticulosAdapter(ArticulosPort):

    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Articulo | None:
        fila = self.db.queryone(
            """
            select id, nombre, precio from articulo where id=%(id)s
            """,
            {"id": id},
        )

        if fila is None:
            return None

        return Articulo(fila["id"], fila["codigo"], fila["nombre"])

    def find_all(self, filtro: str) -> list:
        filas = self.db.queryall(
            """
            select id, nombre, precio from articulo where nombre LIKE %(filtro)s
            """,
            {"filtro": "%" + filtro + "%"},
        )

        lista = []
        for fila in filas:
            lista.append(Articulo(fila["id"], fila["nombre"], fila["precio"]))
        return lista

    def save(self, articulo: Articulo) -> None:
        sql = """
        insert into articulo (id, nombre, precio) 
        values (%(id)s, %(codigo)s, %(nombre)s)
        on conflict (id) do update set nombre=%(nombre)s, precio=%(precio)s
        """

        self.db.execute(
            sql,
            {"id": articulo.id(), "nombre": articulo.nombre(), "precio": articulo.precio()},
        )

    def delete(self, articuloId: int) -> None:
        self.db.execute(
            """
            delete from articulo where id=%(id)s
            """,
            {"id": articuloId},
        )

    def get_next_id(self) -> int:
        fila = self.db.queryone(
            """
            select nextval('articulo_id_seq') as id
            """, ()
        )
        return fila["id"]
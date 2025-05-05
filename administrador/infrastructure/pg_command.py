import psycopg as pg
from psycopg.rows import dict_row

class PGCommand:

    @classmethod
    def get_connection(self):
        conn = pg.connect(
            dbname="almacen",
            user="ucb",
            host="localhost",
            password="Tarija2024",
            port=5432,
            row_factory=dict_row,
        )
        return conn

    def execute(self, sql: str, parameters: tuple) -> int:
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                return cur.execute(sql, parameters).rowcount
        return 0

    def queryone(self, sql: str, parameters: tuple) -> dict | None:
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, parameters)
                return cur.fetchone()
        return None

    def queryall(self, sql: str, parameters: dict | tuple | list) -> list:
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, parameters)
                return cur.fetchall()
        return []

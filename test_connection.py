import psycopg as pg

try:
    conn = pg.connect(
        dbname="almacen",
        user="ucb",
        host="localhost",
        password="Tarija2024",
        port=5432
    )
    print("Conexion exitosa a PostgreSQL")
    conn.close()
except Exception as e:
    print("Error al conectar a PostgreSQL:", e)
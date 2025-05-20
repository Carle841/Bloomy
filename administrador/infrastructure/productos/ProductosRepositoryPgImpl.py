from administrador.domain.productos.producto import Producto
from administrador.domain.productos.producto_repository_port import ProductoRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class ProductoRepositoryPgImpl(ProductoRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Producto | None:
        fila = self.db.queryone("""
            SELECT id, nombre, codigo, categoria_id, precio, stock, estado, descripcion
            FROM tienda.productos
            WHERE id = %(id)s
        """, {"id": id})
        if fila:
            return Producto(
                id=fila["id"],
                nombre=fila["nombre"],
                codigo=fila["codigo"],
                categoria_id=fila["categoria_id"],
                precio=fila["precio"],
                stock=fila["stock"],
                estado=fila["estado"],
                descripcion=fila["descripcion"]
            )
        return None

    def store(self, producto: Producto) -> None:
        sql = """
        INSERT INTO tienda.productos (id, nombre, codigo, categoria_id, precio, stock, estado, descripcion)
        VALUES (%(id)s, %(nombre)s, %(codigo)s, %(categoria_id)s, %(precio)s, %(stock)s, %(estado)s, %(descripcion)s)
        ON CONFLICT (id) DO UPDATE SET
            nombre = EXCLUDED.nombre,
            codigo = EXCLUDED.codigo,
            categoria_id = EXCLUDED.categoria_id,
            precio = EXCLUDED.precio,
            stock = EXCLUDED.stock,
            estado = EXCLUDED.estado,
            descripcion = EXCLUDED.descripcion
        """
        self.db.execute(sql, {
            "id": producto.get_id(),
            "nombre": producto.get_nombre(),
            "codigo": producto.get_codigo(),
            "categoria_id": producto.get_categoria_id(),
            "precio": producto.get_precio(),
            "stock": producto.get_stock(),
            "estado": producto.get_estado(),
            "descripcion": producto.get_descripcion()
        })

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.productos WHERE id = %(id)s", {"id": id})

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.productos_id_seq') as id", {})
        return fila["id"]

    def find(self, filtro: str) -> list[Producto]:
        filas = self.db.queryall("""
            SELECT id, nombre, codigo, categoria_id, precio, stock, estado, descripcion
            FROM tienda.productos
            WHERE nombre ILIKE %(filtro)s OR codigo ILIKE %(filtro)s
        """, {"filtro": f"%{filtro}%"})
        return [
            Producto(
                id=f["id"],
                nombre=f["nombre"],
                codigo=f["codigo"],
                categoria_id=f["categoria_id"],
                precio=f["precio"],
                stock=f["stock"],
                estado=f["estado"],
                descripcion=f["descripcion"]
            ) for f in filas
        ]


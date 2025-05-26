from administrador.domain.combos_productos.combos_productos import ComboProducto
from administrador.domain.combos_productos.combos_productos_repository_port import ComboProductoRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class ComboProductoRepository(ComboProductoRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, combo_id: int, producto_id: int) -> ComboProducto | None:
        fila = self.db.queryone(
            """
            SELECT combo_id, producto_id, cantidad, subtotal
            FROM tienda.combos_productos
            WHERE combo_id = %(combo_id)s AND producto_id = %(producto_id)s
            """,
            {"combo_id": combo_id, "producto_id": producto_id}
        )
        if fila:
            return ComboProducto(
                combo_id=fila["combo_id"],
                producto_id=fila["producto_id"],
                cantidad=fila["cantidad"],
                subtotal=fila["subtotal"]
            )
        return None

    def store(self, combo_producto: ComboProducto) -> None:
        self.db.execute(
            """
            INSERT INTO tienda.combos_productos (combo_id, producto_id, cantidad, subtotal)
            VALUES (%(combo_id)s, %(producto_id)s, %(cantidad)s, %(subtotal)s)
            ON CONFLICT (combo_id, producto_id) DO UPDATE
            SET cantidad = EXCLUDED.cantidad, subtotal = EXCLUDED.subtotal
            """,
            {
                "combo_id": combo_producto.get_combo_id(),
                "producto_id": combo_producto.get_producto_id(),
                "cantidad": combo_producto.get_cantidad(),
                "subtotal": combo_producto.get_subtotal()
            }
        )

    def delete(self, combo_id: int, producto_id: int) -> None:
        self.db.execute(
            """
            DELETE FROM tienda.combos_productos
            WHERE combo_id = %(combo_id)s AND producto_id = %(producto_id)s
            """,
            {"combo_id": combo_id, "producto_id": producto_id}
        )

    def next_identity(self) -> tuple[int, int]:
        raise NotImplementedError("ComboProducto usa combo_id y producto_id proporcionados")

    def find(self, combo_id: int) -> list[ComboProducto]:
        filas = self.db.queryall(
            """
            SELECT combo_id, producto_id, cantidad, subtotal
            FROM tienda.combos_productos
            WHERE combo_id = %(combo_id)s
            """,
            {"combo_id": combo_id}
        )
        return [
            ComboProducto(
                combo_id=fila["combo_id"],
                producto_id=fila["producto_id"],
                cantidad=fila["cantidad"],
                subtotal=fila["subtotal"]
            ) for fila in filas
        ]
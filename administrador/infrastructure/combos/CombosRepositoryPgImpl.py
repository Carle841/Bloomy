from administrador.domain.combos.combo import Combo
from administrador.domain.combos.combo_repository_port import ComboRepositoryPort
from administrador.infrastructure.pg_command import PGCommand
from datetime import datetime

class CombosRepositoryPgImpl(ComboRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Combo | None:
        fila = self.db.queryone(
            """
            SELECT id, nombre, descripcion, stock, descuento_porcentaje,
                   precio_sin_descuento, precio_con_descuento, imagen_principal,
                   fecha_creacion, estado
            FROM tienda.combos
            WHERE id = %(id)s
            """,
            {"id": id}
        )
        if fila:
            return Combo(
                id=fila["id"],
                nombre=fila["nombre"],
                descripcion=fila["descripcion"],
                stock=fila["stock"],
                descuento_porcentaje=fila["descuento_porcentaje"],
                precio_sin_descuento=fila["precio_sin_descuento"],
                precio_con_descuento=fila["precio_con_descuento"],
                imagen_principal=fila["imagen_principal"],
                fecha_creacion=fila["fecha_creacion"],
                estado=fila["estado"]
            )
        return None

    def find_by_id(self, id: int) -> Combo | None:
        return self.get_by_id(id)

    def store(self, combo: Combo) -> None:
        self.db.execute(
            """
            INSERT INTO tienda.combos (
                id, nombre, descripcion, stock, descuento_porcentaje,
                precio_sin_descuento, precio_con_descuento, imagen_principal,
                fecha_creacion, estado
            )
            VALUES (
                %(id)s, %(nombre)s, %(descripcion)s, %(stock)s,
                %(descuento_porcentaje)s, %(precio_sin_descuento)s,
                %(precio_con_descuento)s, %(imagen_principal)s,
                %(fecha_creacion)s, %(estado)s
            )
            ON CONFLICT (id) DO UPDATE
            SET nombre = EXCLUDED.nombre,
                descripcion = EXCLUDED.descripcion,
                stock = EXCLUDED.stock,
                descuento_porcentaje = EXCLUDED.descuento_porcentaje,
                precio_sin_descuento = EXCLUDED.precio_sin_descuento,
                precio_con_descuento = EXCLUDED.precio_con_descuento,
                imagen_principal = EXCLUDED.imagen_principal,
                estado = EXCLUDED.estado
            """,
            {
                "id": combo.get_id(),
                "nombre": combo.get_nombre(),
                "descripcion": combo.get_descripcion(),
                "stock": combo.get_stock(),
                "descuento_porcentaje": combo.get_descuento_porcentaje(),
                "precio_sin_descuento": combo.get_precio_sin_descuento(),
                "precio_con_descuento": combo.get_precio_con_descuento(),
                "imagen_principal": combo.get_imagen_principal(),
                "fecha_creacion": combo.get_fecha_creacion(),
                "estado": combo.get_estado()
            }
        )

    def delete(self, id: int) -> None:
        self.db.execute(
            "DELETE FROM tienda.combos WHERE id = %(id)s",
            {"id": id}
        )

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.combos_id_seq') AS id", {})
        return fila["id"]

    def find(self, filtro: str) -> list[Combo]:
        filas = self.db.queryall(
            """
            SELECT id, nombre, descripcion, stock, descuento_porcentaje,
                   precio_sin_descuento, precio_con_descuento, imagen_principal,
                   fecha_creacion, estado
            FROM tienda.combos
            WHERE nombre ILIKE %(filtro)s OR descripcion ILIKE %(filtro)s
            """,
            {"filtro": f"%{filtro}%"}
        )
        return [
            Combo(
                id=fila["id"],
                nombre=fila["nombre"],
                descripcion=fila["descripcion"],
                stock=fila["stock"],
                descuento_porcentaje=fila["descuento_porcentaje"],
                precio_sin_descuento=fila["precio_sin_descuento"],
                precio_con_descuento=fila["precio_con_descuento"],
                imagen_principal=fila["imagen_principal"],
                fecha_creacion=fila["fecha_creacion"],
                estado=fila["estado"]
            ) for fila in filas
        ]

    def update(self, combo: Combo) -> None:
        self.db.execute(
            """
            UPDATE tienda.combos
            SET nombre = %(nombre)s,
                descripcion = %(descripcion)s,
                stock = %(stock)s,
                descuento_porcentaje = %(descuento_porcentaje)s,
                precio_sin_descuento = %(precio_sin_descuento)s,
                precio_con_descuento = %(precio_con_descuento)s,
                imagen_principal = %(imagen_principal)s,
                estado = %(estado)s
            WHERE id = %(id)s
            """,
            {
                "id": combo.get_id(),
                "nombre": combo.get_nombre(),
                "descripcion": combo.get_descripcion(),
                "stock": combo.get_stock(),
                "descuento_porcentaje": combo.get_descuento_porcentaje(),
                "precio_sin_descuento": combo.get_precio_sin_descuento(),
                "precio_con_descuento": combo.get_precio_con_descuento(),
                "imagen_principal": combo.get_imagen_principal(),
                "estado": combo.get_estado()
            }
        )

    def update_precios(self, combo_id: int, precio_sin_descuento: float, precio_con_descuento: float) -> None:
        self.db.execute(
            """
            UPDATE tienda.combos
            SET precio_sin_descuento = %(precio_sin_descuento)s,
                precio_con_descuento = %(precio_con_descuento)s
            WHERE id = %(combo_id)s
            """,
            {
                "combo_id": combo_id,
                "precio_sin_descuento": precio_sin_descuento,
                "precio_con_descuento": precio_con_descuento
            }
        )
from typing import List, Optional
from datetime import date
from decimal import Decimal
from administrador.domain.ventas.venta import Venta
from administrador.domain.ventas.venta_completa import VentaCompleta, ProductoDetalle, ComboDetalle, ProductoAsociadoCombo
from administrador.domain.ventas.venta_repository_port import VentaRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class VentasRepositoryPgImpl(VentaRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Optional[Venta]:
        fila = self.db.queryone("""
            SELECT v.id, v.numero, v.fecha, v.cliente_id, v.total, v.estado, v.direccion,
                   v.observaciones, c.nombre AS cliente
            FROM tienda.ventas v
            JOIN tienda.usuarios c ON v.cliente_id = c.id
            WHERE v.id = %(id)s
        """, {"id": id})

        if not fila:
            return None

        return Venta(
            id=fila["id"],
            numero=fila["numero"],
            fecha=fila["fecha"],
            cliente_id=fila["cliente_id"],
            total=fila["total"],
            estado=fila["estado"],
            direccion=fila["direccion"],
            observaciones=fila["observaciones"],
            cliente=fila["cliente"]
        )

    def store(self, venta: Venta) -> None:
        sql = """
        INSERT INTO tienda.ventas (
            id, numero, fecha, cliente_id, total, estado, direccion, observaciones
        ) VALUES (
            %(id)s, %(numero)s, %(fecha)s, %(cliente_id)s, %(total)s, %(estado)s,
            %(direccion)s, %(observaciones)s
        )
        ON CONFLICT (id) DO UPDATE 
        SET estado = EXCLUDED.estado
        """
        self.db.execute(sql, {
            "id": venta.get_id(),
            "numero": venta.get_numero(),
            "fecha": venta.get_fecha(),
            "cliente_id": venta.get_cliente_id(),
            "total": venta.get_total(),
            "estado": venta.get_estado(),
            "direccion": venta.get_direccion(),
            "observaciones": venta.get_observaciones()
        })

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.ventas WHERE id = %(id)s", {"id": id})

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.ventas_id_seq') AS id", {})
        return fila["id"]

    def find(self, busqueda: str) -> List[Venta]:
        filas = self.db.queryall("""
            SELECT v.id, v.numero, v.fecha, v.cliente_id, v.total, v.estado, v.direccion,
                   v.observaciones, c.nombre AS cliente,
                   (SELECT COUNT(*) FROM tienda.detalles_venta dv WHERE dv.venta_id = v.id) AS cantidad_productos
            FROM tienda.ventas v
            JOIN tienda.usuarios c ON v.cliente_id = c.id
            WHERE v.numero ILIKE %(busqueda)s
               OR c.nombre ILIKE %(busqueda)s
        """, {"busqueda": f"%{busqueda}%"})

        return [
            Venta(
                id=f["id"],
                numero=f["numero"],
                fecha=f["fecha"],
                cliente_id=f["cliente_id"],
                total=f["total"],
                estado=f["estado"],
                direccion=f["direccion"],
                observaciones=f["observaciones"],
                cliente=f["cliente"],
                cantidad_productos=f["cantidad_productos"]
            ) for f in filas
        ]

    def buscar_por_numero(self, numero: str) -> Optional[Venta]:
        fila = self.db.queryone("""
            SELECT v.id, v.numero, v.fecha, v.cliente_id, v.total, v.estado, v.direccion,
                   v.observaciones, c.nombre AS cliente
            FROM tienda.ventas v
            JOIN tienda.usuarios c ON v.cliente_id = c.id
            WHERE v.numero = %(numero)s
        """, {"numero": numero})

        if not fila:
            return None

        return Venta(
            id=fila["id"],
            numero=fila["numero"],
            fecha=fila["fecha"],
            cliente_id=fila["cliente_id"],
            total=fila["total"],
            estado=fila["estado"],
            direccion=fila["direccion"],
            observaciones=fila["observaciones"],
            cliente=fila["cliente"]
        )

    def filtrar(
        self,
        estado: Optional[str] = None,
        cliente_id: Optional[int] = None,
        fecha_desde: Optional[date] = None,
        fecha_hasta: Optional[date] = None
    ) -> List[Venta]:
        query = """
            SELECT v.id, v.numero, v.fecha, v.cliente_id, v.total, v.estado, v.direccion,
                   v.observaciones, COALESCE(c.nombre, 'Desconocido') AS cliente,
                   (SELECT COUNT(*) FROM tienda.detalles_venta dv WHERE dv.venta_id = v.id) AS cantidad_productos
            FROM tienda.ventas v
            LEFT JOIN tienda.usuarios c ON v.cliente_id = c.id
            WHERE 1=1
        """
        params = {}
        conditions = []

        if estado:
            conditions.append("v.estado = %(estado)s::text")
            params["estado"] = estado
        if cliente_id:
            conditions.append("v.cliente_id = %(cliente_id)s")
            params["cliente_id"] = cliente_id
        if fecha_desde:
            conditions.append("v.fecha >= %(fecha_desde)s::date")
            params["fecha_desde"] = fecha_desde
        if fecha_hasta:
            conditions.append("v.fecha <= %(fecha_hasta)s::date")
            params["fecha_hasta"] = fecha_hasta

        if conditions:
            query += " AND " + " AND ".join(conditions)

        filas = self.db.queryall(query, params)

        return [
            Venta(
                id=f["id"],
                numero=f["numero"],
                fecha=f["fecha"],
                cliente_id=f["cliente_id"],
                total=f["total"],
                estado=f["estado"],
                direccion=f["direccion"],
                observaciones=f["observaciones"],
                cliente=f["cliente"],
                cantidad_productos=f["cantidad_productos"]
            ) for f in filas
        ]

    def contar_productos_venta(self, id: int) -> int:
        fila = self.db.queryone("""
            SELECT COUNT(*) AS count
            FROM tienda.detalles_venta
            WHERE venta_id = %(id)s
        """, {"id": id})
        return fila["count"]

    def buscar_venta_todo(self, id: int) -> Optional[VentaCompleta]:
        # Obtener datos de la venta y cliente
        fila = self.db.queryone("""
            SELECT 
                v.id, v.numero, c.nombre AS cliente, c.email, v.estado, c.telefono AS celular,
                v.fecha, v.direccion, v.observaciones, v.total
            FROM tienda.ventas v
            JOIN tienda.usuarios c ON v.cliente_id = c.id
            WHERE v.id = %(id)s
        """, {"id": id})

        if not fila:
            return None

        # Obtener detalles de productos y combos
        detalles = self.db.queryall("""
            SELECT 
                dv.producto_id, dv.combo_id, dv.cantidad, dv.precio_unitario, dv.subtotal,
                COALESCE(p.nombre, c.nombre) AS nombre,
                CASE 
                    WHEN dv.producto_id IS NOT NULL THEN 'producto'
                    ELSE 'combo'
                END AS tipo
            FROM tienda.detalles_venta dv
            LEFT JOIN tienda.productos p ON dv.producto_id = p.id
            LEFT JOIN tienda.combos c ON dv.combo_id = c.id
            WHERE dv.venta_id = %(venta_id)s
        """, {"venta_id": id})

        items = []

        for d in detalles:
            if d["tipo"] == "producto":
                items.append(ProductoDetalle(
                    nombre=d["nombre"],
                    cantidad=d["cantidad"],
                    precio_unitario=Decimal(str(d["precio_unitario"])),
                    subtotal=Decimal(str(d["subtotal"]))
                ))
            else:  # tipo == "combo"
                # Obtener productos asociados al combo
                productos_asociados = self.db.queryall("""
                    SELECT p.nombre, cp.cantidad, cp.subtotal
                    FROM tienda.combos_productos cp
                    JOIN tienda.productos p ON cp.producto_id = p.id
                    WHERE cp.combo_id = %(combo_id)s
                """, {"combo_id": d["combo_id"]})

                productos_asociados_lista = [
                    ProductoAsociadoCombo(
                        nombre=p["nombre"],
                        cantidad=p["cantidad"],
                        subtotal=Decimal(str(p["subtotal"]))
                    ) for p in productos_asociados
                ]

                items.append(ComboDetalle(
                    nombre=d["nombre"],
                    cantidad=d["cantidad"],
                    precio_unitario=Decimal(str(d["precio_unitario"])),
                    subtotal=Decimal(str(d["subtotal"])),
                    productos_asociados=productos_asociados_lista
                ))

        return VentaCompleta(
            id=fila["id"],
            numero=fila["numero"],
            cliente=fila["cliente"],
            email=fila["email"],
            estado=fila["estado"],
            celular=fila["celular"],
            fecha=fila["fecha"],
            direccion=fila["direccion"],
            observaciones=fila["observaciones"],
            items=items,
            total=Decimal(str(fila["total"]))
        )
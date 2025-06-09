from typing import List, Optional
from datetime import date
from decimal import Decimal
from administrador.domain.orden_compra.orden_compra import OrdenCompra
from administrador.domain.orden_compra.orden_compra_completa import OrdenCompraCompleta, ProductoDetalle
from administrador.domain.orden_compra.orden_compra_repository_port import OrdenCompraRepositoryPort
from administrador.infrastructure.pg_command import PGCommand

class OrdenesCompraRepositoryPgImpl(OrdenCompraRepositoryPort):
    def __init__(self, db: PGCommand):
        self.db = db

    def get_by_id(self, id: int) -> Optional[OrdenCompra]:
        fila = self.db.queryone("""
            SELECT oc.id, oc.numero_orden, oc.proveedor_id, oc.fecha_orden, oc.fecha_entrega_esperada,
                   oc.metodo_pago, oc.notas, oc.estado, oc.total, p.nombre AS proveedor
            FROM tienda.ordenes_compra oc
            JOIN tienda.proveedores p ON oc.proveedor_id = p.id
            WHERE oc.id = %(id)s
        """, {"id": id})

        if not fila:
            return None

        return OrdenCompra(
            id=fila["id"],
            numero_orden=fila["numero_orden"],
            proveedor_id=fila["proveedor_id"],
            fecha_orden=fila["fecha_orden"],
            fecha_entrega_esperada=fila["fecha_entrega_esperada"],
            metodo_pago=fila["metodo_pago"],
            notas=fila["notas"],
            estado=fila["estado"],
            total=fila["total"],
            proveedor=fila["proveedor"]
        )

    def store(self, orden: OrdenCompra) -> None:
        sql = """
        INSERT INTO tienda.ordenes_compra (
            id, numero_orden, proveedor_id, fecha_orden, fecha_entrega_esperada,
            metodo_pago, notas, estado, total
        ) VALUES (
            %(id)s, %(numero_orden)s, %(proveedor_id)s, %(fecha_orden)s,
            %(fecha_entrega_esperada)s, %(metodo_pago)s, %(notas)s, %(estado)s,
            %(total)s
        )
        ON CONFLICT (id) DO UPDATE 
        SET numero_orden = EXCLUDED.numero_orden,
            proveedor_id = EXCLUDED.proveedor_id,
            fecha_orden = EXCLUDED.fecha_orden,
            fecha_entrega_esperada = EXCLUDED.fecha_entrega_esperada,
            metodo_pago = EXCLUDED.metodo_pago,
            notas = EXCLUDED.notas,
            estado = EXCLUDED.estado,
            total = EXCLUDED.total
        """
        self.db.execute(sql, {
            "id": orden.get_id(),
            "numero_orden": orden.get_numero_orden(),
            "proveedor_id": orden.get_proveedor_id(),
            "fecha_orden": orden.get_fecha_orden(),
            "fecha_entrega_esperada": orden.get_fecha_entrega_esperada(),
            "metodo_pago": orden.get_metodo_pago(),
            "notas": orden.get_notas(),
            "estado": orden.get_estado(),
            "total": orden.get_total()
        })

    def delete(self, id: int) -> None:
        self.db.execute("DELETE FROM tienda.ordenes_compra WHERE id = %(id)s", {"id": id})

    def next_identity(self) -> int:
        fila = self.db.queryone("SELECT nextval('tienda.ordenes_compra_id_seq') AS id", {})
        return fila["id"]

    def find(self, busqueda: str) -> List[OrdenCompra]:
        filas = self.db.queryall("""
            SELECT oc.id, oc.numero_orden, oc.proveedor_id, oc.fecha_orden,
                   oc.fecha_entrega_esperada AS fecha_entrega, oc.metodo_pago, oc.notas, oc.estado,
                   oc.total, p.nombre AS proveedor,
                   (SELECT COUNT(*) FROM tienda.detalles_orden_compra doc WHERE doc.orden_compra_id = oc.id) AS cantidad_productos
            FROM tienda.ordenes_compra oc
            JOIN tienda.proveedores p ON oc.proveedor_id = p.id
            WHERE oc.numero_orden ILIKE %(busqueda)s
               OR p.nombre ILIKE %(busqueda)s
        """, {"busqueda": f"%{busqueda}%"})

        return [
            OrdenCompra(
                id=f["id"],
                numero_orden=f["numero_orden"],
                proveedor_id=f["proveedor_id"],
                fecha_orden=f["fecha_orden"],
                fecha_entrega_esperada=f["fecha_entrega"],
                metodo_pago=f["metodo_pago"],
                notas=f["notas"],
                estado=f["estado"],
                total=f["total"],
                proveedor=f["proveedor"],
                cantidad_productos=f["cantidad_productos"]
            ) for f in filas
        ]

    def buscar_por_numero_orden(self, numero_orden: str) -> Optional[OrdenCompra]:
        fila = self.db.queryone("""
            SELECT oc.id, oc.numero_orden, oc.proveedor_id, oc.fecha_orden, oc.fecha_entrega_esperada,
                   oc.metodo_pago, oc.notas, oc.estado, oc.total, p.nombre AS proveedor
            FROM tienda.ordenes_compra oc
            JOIN tienda.proveedores p ON oc.proveedor_id = p.id
            WHERE oc.numero_orden = %(numero_orden)s
        """, {"numero_orden": numero_orden})

        if not fila:
            return None

        return OrdenCompra(
            id=fila["id"],
            numero_orden=fila["numero_orden"],
            proveedor_id=fila["proveedor_id"],
            fecha_orden=fila["fecha_orden"],
            fecha_entrega_esperada=fila["fecha_entrega_esperada"],
            metodo_pago=fila["metodo_pago"],
            notas=fila["notas"],
            estado=fila["estado"],
            total=fila["total"],
            proveedor=fila["proveedor"]
        )

    def filtrar(
        self,
        estado: Optional[str] = None,
        proveedor_id: Optional[int] = None,
        fecha_desde: Optional[date] = None,
        fecha_hasta: Optional[date] = None
    ) -> List[OrdenCompra]:
        query = """
            SELECT oc.id, oc.numero_orden, oc.proveedor_id, oc.fecha_orden,
                   oc.fecha_entrega_esperada AS fecha_entrega, oc.metodo_pago, oc.notas, oc.estado,
                   oc.total, COALESCE(p.nombre, 'Desconocido') AS proveedor,
                   (SELECT COUNT(*) FROM tienda.detalles_orden_compra doc WHERE doc.orden_compra_id = oc.id) AS cantidad_productos
            FROM tienda.ordenes_compra oc
            LEFT JOIN tienda.proveedores p ON oc.proveedor_id = p.id
            WHERE 1=1
        """
        params = {}
        conditions = []

        if estado:
            conditions.append("oc.estado = %(estado)s::text")
            params["estado"] = estado
        if proveedor_id:
            conditions.append("oc.proveedor_id = %(proveedor_id)s")
            params["proveedor_id"] = proveedor_id
        if fecha_desde:
            conditions.append("oc.fecha_orden >= %(fecha_desde)s::date")
            params["fecha_desde"] = fecha_desde
        if fecha_hasta:
            conditions.append("oc.fecha_orden <= %(fecha_hasta)s::date")
            params["fecha_hasta"] = fecha_hasta

        if conditions:
            query += " AND " + " AND ".join(conditions)

        filas = self.db.queryall(query, params)

        return [
            OrdenCompra(
                id=f["id"],
                numero_orden=f["numero_orden"],
                proveedor_id=f["proveedor_id"],
                fecha_orden=f["fecha_orden"],
                fecha_entrega_esperada=f["fecha_entrega"],
                metodo_pago=f["metodo_pago"],
                notas=f["notas"],
                estado=f["estado"],
                total=f["total"],
                proveedor=f["proveedor"],
                cantidad_productos=f["cantidad_productos"]
            ) for f in filas
        ]

    def buscar_compra_todo(self, id: int) -> Optional[OrdenCompraCompleta]:
        fila = self.db.queryone("""
            SELECT 
                oc.id, oc.numero_orden, p.nombre AS proveedor, oc.estado, p.contacto, p.telefono AS celular,
                oc.fecha_entrega_esperada AS fecha_entrega, oc.fecha_orden, oc.metodo_pago AS metodo_transferencia,
                json_agg(
                    json_build_object(
                        'producto', i.nombre, 'cantidad', doc.cantidad,
                        'precio_unitario', doc.precio_unitario, 'subtotal', doc.subtotal
                    )
                ) AS productos,
                oc.total, oc.notas
            FROM tienda.ordenes_compra oc
            JOIN tienda.proveedores p ON oc.proveedor_id = p.id
            JOIN tienda.detalles_orden_compra doc ON doc.orden_compra_id = oc.id
            JOIN tienda.inventario i ON doc.producto_id = i.id
            WHERE oc.id = %(id)s
            GROUP BY oc.id, oc.numero_orden, p.nombre, oc.estado, p.contacto, p.telefono,
                     oc.fecha_entrega_esperada, oc.fecha_orden, oc.metodo_pago, oc.notas, oc.total
        """, {"id": id})

        if not fila:
            return None

        productos = [
            ProductoDetalle(
                producto=p["producto"],
                cantidad=p["cantidad"],
                precio_unitario=Decimal(str(p["precio_unitario"])),
                subtotal=Decimal(str(p["subtotal"]))
            ) for p in fila["productos"]
        ]

        return OrdenCompraCompleta(
            id=fila["id"],
            numero_orden=fila["numero_orden"],
            proveedor=fila["proveedor"],
            estado=fila["estado"],
            contacto=fila["contacto"],
            celular=fila["celular"],
            fecha_entrega=fila["fecha_entrega"],
            fecha_orden=fila["fecha_orden"],
            metodo_transferencia=fila["metodo_transferencia"],
            productos=productos,
            total=Decimal(str(fila["total"])),
            notas=fila["notas"]
        )

    def contar_productos_orden(self, id: int) -> int:
        fila = self.db.queryone("""
            SELECT COUNT(*) AS count
            FROM tienda.detalles_orden_compra
            WHERE orden_compra_id = %(id)s
        """, {"id": id})
        return fila["count"]
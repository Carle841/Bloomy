from flask import json, request
from administrador.application.detalles_orden_compra.crear_detalle_orden_compra_usecase import CrearDetalleOrdenCompraUseCase
from administrador.application.detalles_orden_compra.actualizar_detalle_orden_compra_usecase import ActualizarDetalleOrdenCompraUseCase
from administrador.application.detalles_orden_compra.buscar_detalle_orden_compra_usecase import BuscarDetalleOrdenCompraUseCase
from administrador.application.detalles_orden_compra.eliminar_detalle_orden_compra_usecase import EliminarDetalleOrdenCompraUseCase
from administrador.infrastructure.detalles_ordenes_compra.DetallesOrdenCompraRepositoryPgImpl import DetallesOrdenesComprasRepositoryPgImpl
from administrador import app, db

@app.route("/api/detalles_orden_compra/create", methods=["POST"])
def detalles_orden_compra_api_create():
    repo = DetallesOrdenesComprasRepositoryPgImpl(db)
    use_case = CrearDetalleOrdenCompraUseCase(repo, db)

    data = request.get_json()
    try:
        if not data:
            raise ValueError("No se proporcionó cuerpo JSON")

        orden_compra_id = data.get("orden_compra_id")
        producto_id = data.get("producto_id")
        cantidad = data.get("cantidad")

        if not all([orden_compra_id, producto_id, cantidad]):
            raise ValueError("Faltan campos requeridos: orden_compra_id, producto_id, cantidad")

        nuevo_id = use_case.execute(
            orden_compra_id=int(orden_compra_id),
            producto_id=int(producto_id),
            cantidad=int(cantidad)
        )

        # Actualizar total de la orden
        db.execute("""
            UPDATE tienda.ordenes_compra
            SET total = (
                SELECT COALESCE(SUM(subtotal), 0)
                FROM tienda.detalles_orden_compra
                WHERE orden_compra_id = %(orden_compra_id)s
            )
            WHERE id = %(orden_compra_id)s
        """, {"orden_compra_id": orden_compra_id})

        response = {
            "success": "1",
            "message": "Detalle de orden de compra creado",
            "id": nuevo_id
        }
    except Exception as e:
        response = {
            "success": "0",
            "error": str(e)
        }

    return app.response_class(
        response=json.dumps(response),
        mimetype='application/json'
    )

@app.route("/api/detalles_orden_compra/edit/<id>", methods=["POST"])
def detalles_orden_compra_api_update(id):
    repo = DetallesOrdenesComprasRepositoryPgImpl(db)
    use_case = ActualizarDetalleOrdenCompraUseCase(repo, db)

    data = request.get_json()
    try:
        if not data:
            raise ValueError("No se proporcionó cuerpo JSON")

        producto_id = data.get("producto_id")
        cantidad = data.get("cantidad")

        if producto_id is not None:
            producto_id = int(producto_id)
        if cantidad is not None:
            cantidad = int(cantidad)

        # Obtener orden_compra_id antes de actualizar
        detalle = repo.get_by_id(int(id))
        if not detalle:
            raise ValueError("Detalle de orden de compra no encontrado")
        orden_compra_id = detalle.get_orden_compra_id()

        use_case.execute(
            id=int(id),
            producto_id=producto_id,
            cantidad=cantidad
        )

        # Actualizar total de la orden
        db.execute("""
            UPDATE tienda.ordenes_compra
            SET total = (
                SELECT COALESCE(SUM(subtotal), 0)
                FROM tienda.detalles_orden_compra
                WHERE orden_compra_id = %(orden_compra_id)s
            )
            WHERE id = %(orden_compra_id)s
        """, {"orden_compra_id": orden_compra_id})

        response = {
            "success": "1",
            "message": "Detalle de orden de compra actualizado"
        }
    except Exception as e:
        response = {
            "success": "0",
            "error": str(e)
        }

    return app.response_class(
        response=json.dumps(response),
        mimetype='application/json'
    )

@app.route("/api/detalles_orden_compra/<orden_compra_id>", methods=["GET"])
def detalles_orden_compra_api_get_by_orden_compra_id(orden_compra_id):
    try:
        repo = DetallesOrdenesComprasRepositoryPgImpl(db)
        use_case = BuscarDetalleOrdenCompraUseCase(repo)

        detalles = use_case.execute(int(orden_compra_id))
        data = []
        for detalle in detalles:
            data.append({
                "id": detalle.get_id(),
                "orden_compra_id": detalle.get_orden_compra_id(),
                "producto_id": detalle.get_producto_id(),
                "cantidad": detalle.get_cantidad(),
                "precio_unitario": float(detalle.get_precio_unitario()),
                "subtotal": float(detalle.get_subtotal())
            })

        return app.response_class(
            response=json.dumps({
                "success": "1",
                "detalles": data
            }),
            mimetype='application/json'
        )
    except Exception as e:
        return app.response_class(
            response=json.dumps({
                "success": "0",
                "error": str(e)
            }),
            mimetype='application/json'
        )

@app.route("/api/detalles_orden_compra/delete/<id>", methods=["POST"])
def detalles_orden_compra_api_delete(id):
    try:
        repo = DetallesOrdenesComprasRepositoryPgImpl(db)
        use_case = EliminarDetalleOrdenCompraUseCase(repo)

        # Obtener orden_compra_id antes de eliminar
        detalle = repo.get_by_id(int(id))
        if not detalle:
            raise ValueError("Detalle de orden de compra no encontrado")
        orden_compra_id = detalle.get_orden_compra_id()

        use_case.execute(int(id))

        # Actualizar total de la orden
        db.execute("""
            UPDATE tienda.ordenes_compra
            SET total = (
                SELECT COALESCE(SUM(subtotal), 0)
                FROM tienda.detalles_orden_compra
                WHERE orden_compra_id = %(orden_compra_id)s
            )
            WHERE id = %(orden_compra_id)s
        """, {"orden_compra_id": orden_compra_id})

        response = {
            "success": "1",
            "message": "Detalle de orden de compra eliminado"
        }
    except Exception as e:
        response = {
            "success": "0",
            "error": str(e)
        }

    return app.response_class(
        response=json.dumps(response),
        mimetype='application/json'
    )
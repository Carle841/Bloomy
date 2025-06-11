from flask import json, request
from administrador.application.detalles_venta.crear_detalle_venta_usecase import CrearDetalleVentaUseCase
from administrador.application.detalles_venta.actualizar_detalle_venta_usecase import ActualizarDetalleVentaUseCase
from administrador.application.detalles_venta.buscar_detalle_venta_usecase import BuscarDetalleVentaUseCase
from administrador.application.detalles_venta.eliminar_detalle_venta_usecase import EliminarDetalleVentaUseCase
from administrador.infrastructure.detalles_venta.DetallesVentaRepositoryPgImpl import DetallesVentaRepositoryPgImpl
from administrador import app, db

@app.route("/api/detalles_venta/create", methods=["POST"])
def detalles_venta_api_create():
    repo = DetallesVentaRepositoryPgImpl(db)
    use_case = CrearDetalleVentaUseCase(repo, db)

    data = request.get_json()
    try:
        if not data:
            raise ValueError("No se proporcionó cuerpo JSON")

        venta_id = data.get("venta_id")
        producto_id = data.get("producto_id")
        combo_id = data.get("combo_id")
        cantidad = data.get("cantidad", 1)

        if not venta_id or (producto_id is None and combo_id is None):
            raise ValueError("Faltan campos requeridos: venta_id y producto_id o combo_id")
        if producto_id is not None and combo_id is not None:
            raise ValueError("No se pueden especificar producto_id y combo_id simultáneamente")

        nuevo_id = use_case.execute(
            venta_id=int(venta_id),
            producto_id=int(producto_id) if producto_id else None,
            combo_id=int(combo_id) if combo_id else None,
            cantidad=int(cantidad)
        )

        response = {
            "success": "1",
            "message": "Detalle de venta creado",
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

@app.route("/api/detalles_venta/edit/<id>", methods=["POST"])
def detalles_venta_api_update(id):
    repo = DetallesVentaRepositoryPgImpl(db)
    use_case = ActualizarDetalleVentaUseCase(repo, db)

    data = request.get_json()
    try:
        if not data:
            raise ValueError("No se proporcionó cuerpo JSON")

        producto_id = data.get("producto_id")
        combo_id = data.get("combo_id")
        cantidad = data.get("cantidad")

        if producto_id is not None:
            producto_id = int(producto_id)
        if combo_id is not None:
            combo_id = int(combo_id)
        if cantidad is not None:
            cantidad = int(cantidad)

        use_case.execute(
            id=int(id),
            producto_id=producto_id,
            combo_id=combo_id,
            cantidad=cantidad
        )

        response = {
            "success": "1",
            "message": "Detalle de venta actualizado"
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

@app.route("/api/detalles_venta/<venta_id>", methods=["GET"])
def detalles_venta_api_get_by_venta_id(venta_id):
    try:
        repo = DetallesVentaRepositoryPgImpl(db)
        use_case = BuscarDetalleVentaUseCase(repo)

        detalles = use_case.execute(int(venta_id))
        data = []
        for detalle in detalles:
            data.append({
                "id": detalle.get_id(),
                "venta_id": detalle.get_venta_id(),
                "producto_id": detalle.get_producto_id(),
                "combo_id": detalle.get_combo_id(),
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

@app.route("/api/detalles_venta/delete/<id>", methods=["POST"])
def detalles_venta_api_delete(id):
    try:
        repo = DetallesVentaRepositoryPgImpl(db)
        use_case = EliminarDetalleVentaUseCase(repo, db)

        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Detalle de venta eliminado"
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
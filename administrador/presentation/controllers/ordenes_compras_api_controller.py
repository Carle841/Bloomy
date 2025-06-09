from flask import json, request
from administrador.domain.orden_compra.orden_compra import OrdenCompra
from administrador.domain.orden_compra.orden_compra_completa import OrdenCompraCompleta, ProductoDetalle
from administrador.infrastructure.ordenes_compra.OrdenesComprasRepositoryPgImpl import OrdenesCompraRepositoryPgImpl
from administrador.application.ordenes_compra.crear_orden_compra_usecase import CrearOrdenCompraUseCase
from administrador.application.ordenes_compra.eliminar_orden_compra_usecase import EliminarOrdenCompraUseCase
from administrador.application.ordenes_compra.buscar_orden_compra_usecase import BuscarOrdenCompraUseCase
from administrador.application.ordenes_compra.actualizar_orden_compra_usecase import ActualizarOrdenCompraUseCase
from administrador.application.ordenes_compra.listar_orden_compra_usecase import ListarOrdenCompraUseCase
from administrador.application.ordenes_compra.buscar_compra_todo_usecase import BuscarCompraTodoUseCase
from administrador.application.ordenes_compra.contar_productos_orden_usecase import ContarProductosOrdenUseCase
from administrador import app, db
from datetime import datetime

@app.route("/api/ordenes_compra/create", methods=["POST"])
def ordenes_compras_api_create():
    repo = OrdenesCompraRepositoryPgImpl(db)
    use_case = CrearOrdenCompraUseCase(repo)

    data = request.json
    try:
        nuevo_id = use_case.execute(
            proveedor_id=data["proveedor_id"],
            fecha_entrega_esperada=datetime.strptime(data["fecha_entrega_esperada"], "%Y-%m-%d").date() if data.get("fecha_entrega_esperada") else None,
            metodo_pago=data.get("metodo_pago"),
            notas=data.get("notas")
        )
        response = {
            "success": "1",
            "message": "Orden de compra creada",
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

@app.route("/api/ordenes_compra/delete/<id>", methods=["POST"])
def ordenes_compras_api_delete(id):
    try:
        repo = OrdenesCompraRepositoryPgImpl(db)
        use_case = EliminarOrdenCompraUseCase(repo)
        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Orden de compra eliminada"
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

@app.route("/api/ordenes_compra", methods=["GET"])
def ordenes_compras_api_index():
    try:
        repo = OrdenesCompraRepositoryPgImpl(db)
        busqueda = request.args.get("busqueda", "").strip()

        if busqueda:
            use_case = BuscarOrdenCompraUseCase(repo)
            ordenes = use_case.execute(busqueda)
        else:
            estado = request.args.get("estado")
            proveedor_id = int(request.args["proveedor_id"]) if request.args.get("proveedor_id") else None
            fecha_desde = datetime.strptime(request.args["fecha_desde"], "%Y-%m-%d").date() if request.args.get("fecha_desde") else None
            fecha_hasta = datetime.strptime(request.args["fecha_hasta"], "%Y-%m-%d").date() if request.args.get("fecha_hasta") else None
            use_case = ListarOrdenCompraUseCase(repo)
            ordenes = use_case.execute(estado, proveedor_id, fecha_desde, fecha_hasta)

        data = [
            {
                "id": orden.get_id(),
                "numero_orden": orden.get_numero_orden(),
                "proveedor": orden.get_proveedor() or f"ID {orden.get_proveedor_id()}",
                "fecha_entrega": orden.get_fecha_entrega_esperada().isoformat() if orden.get_fecha_entrega_esperada() else None,
                "cantidad_productos": orden.get_cantidad_productos() or 0,
                "total": float(orden.get_total()) if orden.get_total() else 0.0,
                "estado": orden.get_estado()
            }
            for orden in ordenes
        ]

        return app.response_class(
            response=json.dumps(data),
            mimetype='application/json'
        )
    except ValueError as e:
        return app.response_class(
            response=json.dumps({"success": "0", "error": f"Formato de fecha inválido: {str(e)}"}),
            mimetype='application/json'
        )
    except Exception as e:
        return app.response_class(
            response=json.dumps({"success": "0", "error": str(e)}),
            mimetype='application/json'
        )

@app.route("/api/ordenes_compra/<id>", methods=["GET"])
def ordenes_compras_api_get_one(id):
    try:
        repo = OrdenesCompraRepositoryPgImpl(db)
        orden = repo.get_by_id(int(id))

        if orden is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Orden de compra no encontrada"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "orden": {
                "id": orden.get_id(),
                "numero_orden": orden.get_numero_orden(),
                "proveedor_id": orden.get_proveedor_id(),
                "fecha_orden": orden.get_fecha_orden().isoformat(),
                "fecha_entrega_esperada": orden.get_fecha_entrega_esperada().isoformat() if orden.get_fecha_entrega_esperada() else None,
                "metodo_pago": orden.get_metodo_pago(),
                "notas": orden.get_notas(),
                "estado": orden.get_estado(),
                "total": float(orden.get_total()) if orden.get_total() is not None else None
            }
        }

        return app.response_class(
            response=json.dumps(data),
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

@app.route("/api/ordenes_compra/edit/<id>", methods=["POST"])
def ordenes_compras_api_update(id):
    try:
        repo = OrdenesCompraRepositoryPgImpl(db)
        use_case = ActualizarOrdenCompraUseCase(repo)

        data = request.get_json()
        # Validar que solo se envíe estado
        if set(data.keys()) != {"estado"}:
            raise ValueError("Solo se puede enviar el campo 'estado'")

        use_case.execute(
            id=int(id),
            estado=data["estado"]
        )

        response = {
            "success": "1",
            "message": "Orden de compra actualizada"
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
    
@app.route("/api/ordenes_compra_completo/<id>", methods=["GET"])
def ordenes_compras_api_get_completo(id):
    try:
        repo = OrdenesCompraRepositoryPgImpl(db)
        use_case = BuscarCompraTodoUseCase(repo)
        orden = use_case.execute(int(id))

        if orden is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Orden de compra no encontrada"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "orden": {
                "id": orden.id,
                "numero_orden": orden.numero_orden,
                "proveedor": orden.proveedor,
                "estado": orden.estado,
                "contacto": orden.contacto,
                "celular": orden.celular,
                "fecha_entrega": orden.fecha_entrega.isoformat() if orden.fecha_entrega else None,
                "fecha_orden": orden.fecha_orden.isoformat(),
                "metodo_transferencia": orden.metodo_transferencia,
                "productos": [
                    {
                        "producto": p.producto,
                        "cantidad": p.cantidad,
                        "precio_unitario": float(p.precio_unitario),
                        "subtotal": float(p.subtotal)
                    } for p in orden.productos
                ],
                "total": float(orden.total),
                "notas": orden.notas
            }
        }

        return app.response_class(
            response=json.dumps(data),
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
        
@app.route("/api/ordenes_compra/<id>/productos/count", methods=["GET"])
def ordenes_compras_api_count_productos(id):
    try:
        repo = OrdenesCompraRepositoryPgImpl(db)
        use_case = ContarProductosOrdenUseCase(repo)
        count = use_case.execute(int(id))

        data = {
            "success": "1",
            "count": count
        }

        return app.response_class(
            response=json.dumps(data),
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
from flask import json, request
from administrador.domain.ventas.venta import Venta
from administrador.domain.ventas.venta_completa import VentaCompleta, ProductoDetalle, ComboDetalle
from administrador.infrastructure.ventas.VentasRepositoryPgImpl import VentasRepositoryPgImpl
from administrador.application.ventas.crear_venta_usecase import CrearVentaUseCase
from administrador.application.ventas.eliminar_venta_usecase import EliminarVentaUseCase
from administrador.application.ventas.buscar_venta_usecase import BuscarVentaUseCase
from administrador.application.ventas.actualizar_venta_usecase import ActualizarVentaUseCase
from administrador.application.ventas.listar_venta_usecase import ListarVentaUseCase
from administrador.application.ventas.buscar_venta_todo_usecase import BuscarVentaTodoUseCase
from administrador import app, db
from datetime import datetime

@app.route("/api/ventas/create", methods=["POST"])
def ventas_api_create():
    repo = VentasRepositoryPgImpl(db)
    use_case = CrearVentaUseCase(repo)

    data = request.json
    try:
        nuevo_id = use_case.execute(
            cliente_id=data["cliente_id"],
            direccion=data.get("direccion"),
            observaciones=data.get("observaciones")
        )
        response = {
            "success": "1",
            "message": "Venta creada",
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

@app.route("/api/ventas/delete/<id>", methods=["POST"])
def ventas_api_delete(id):
    try:
        repo = VentasRepositoryPgImpl(db)
        use_case = EliminarVentaUseCase(repo)
        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Venta eliminada"
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

@app.route("/api/ventas", methods=["GET"])
def ventas_api_index():
    try:
        repo = VentasRepositoryPgImpl(db)
        busqueda = request.args.get("busqueda", "").strip()

        if busqueda:
            use_case = BuscarVentaUseCase(repo)
            ventas = use_case.execute(busqueda)
        else:
            estado = request.args.get("estado")
            cliente_id = int(request.args["cliente_id"]) if request.args.get("cliente_id") else None
            fecha_desde = datetime.strptime(request.args["fecha_desde"], "%Y-%m-%d").date() if request.args.get("fecha_desde") else None
            fecha_hasta = datetime.strptime(request.args["fecha_hasta"], "%Y-%m-%d").date() if request.args.get("fecha_hasta") else None
            use_case = ListarVentaUseCase(repo)
            ventas = use_case.execute(estado, cliente_id, fecha_desde, fecha_hasta)

        data = [
            {
                "id": venta.get_id(),
                "numero": venta.get_numero(),
                "cliente": venta.get_cliente() or f"ID {venta.get_cliente_id()}",
                "fecha": venta.get_fecha().isoformat(),
                "cantidad_productos": venta.get_cantidad_productos() or 0,
                "total": float(venta.get_total()) if venta.get_total() else 0.0,
                "estado": venta.get_estado()
            }
            for venta in ventas
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

@app.route("/api/ventas/<id>", methods=["GET"])
def ventas_api_get_one(id):
    try:
        repo = VentasRepositoryPgImpl(db)
        venta = repo.get_by_id(int(id))

        if venta is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Venta no encontrada"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "venta": {
                "id": venta.get_id(),
                "numero": venta.get_numero(),
                "cliente_id": venta.get_cliente_id(),
                "fecha": venta.get_fecha().isoformat(),
                "total": float(venta.get_total()) if venta.get_total() is not None else None,
                "estado": venta.get_estado(),
                "direccion": venta.get_direccion(),
                "observaciones": venta.get_observaciones()
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

@app.route("/api/ventas/edit/<id>", methods=["POST"])
def ventas_api_update(id):
    try:
        repo = VentasRepositoryPgImpl(db)
        use_case = ActualizarVentaUseCase(repo)

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
            "message": "Venta actualizada"
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

@app.route("/api/ventas_completo/<id>", methods=["GET"])
def ventas_api_get_completo(id):
    try:
        repo = VentasRepositoryPgImpl(db)
        use_case = BuscarVentaTodoUseCase(repo)
        venta = use_case.execute(int(id))

        if venta is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Venta no encontrada"
                }),
                mimetype='application/json'
            )

        # Serializar items (productos y combos)
        items = []
        for item in venta.items:
            if isinstance(item, ProductoDetalle):
                items.append({
                    "tipo": "producto",
                    "nombre": item.nombre,
                    "cantidad": item.cantidad,
                    "precio_unitario": float(item.precio_unitario),
                    "subtotal": float(item.subtotal)
                })
            elif isinstance(item, ComboDetalle):
                items.append({
                    "tipo": "combo",
                    "nombre": item.nombre,
                    "cantidad": item.cantidad,
                    "precio_unitario": float(item.precio_unitario),
                    "subtotal": float(item.subtotal),
                    "productos_asociados": [
                        {
                            "nombre": p.nombre,
                            "cantidad": p.cantidad,
                            "subtotal": float(p.subtotal)
                        } for p in item.productos_asociados
                    ]
                })

        data = {
            "success": "1",
            "venta": {
                "id": venta.id,
                "numero": venta.numero,
                "cliente": venta.cliente,
                "email": venta.email,
                "estado": venta.estado,
                "celular": venta.celular,
                "fecha": venta.fecha.isoformat(),
                "direccion": venta.direccion,
                "observaciones": venta.observaciones,
                "items": items,
                "total": float(venta.total)
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

@app.route("/api/ventas/<id>/productos/count", methods=["GET"])
def ventas_api_count_productos(id):
    try:
        repo = VentasRepositoryPgImpl(db)
        count = repo.contar_productos_venta(int(id))

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
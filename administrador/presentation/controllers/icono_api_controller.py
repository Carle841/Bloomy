from flask import json, request
import traceback 
from administrador.domain.iconos.icono import Icono
from administrador.infrastructure.iconos.IconosRepositoryPgImpl import IconoRepositoryPgImpl
from administrador.application.iconos.crear_icono_usecase import CrearIconoUseCase
from administrador.application.iconos.eliminar_icono_usecase import EliminarIconoUseCase
from administrador.application.iconos.obtener_icono_usecase import ObtenerIconoUseCase
from administrador.application.iconos.buscar_icono_usecase import BuscarIconoUseCase
from administrador.application.iconos.actualizar_icono_usecase import ActualizarIconoUseCase
from administrador import app, db

@app.route("/api/iconos", methods=["GET"])
def iconos_api_index():
    try:
        filtro = request.args.get("filtro", "")
        repo = IconoRepositoryPgImpl(db)
        use_case = BuscarIconoUseCase(repo)
        iconos = use_case.execute(filtro)

        data = []
        for icono in iconos:
            data.append({
                "icono_id": icono.get_id(),
                "nombre": icono.get_nombre()
            })

        return app.response_class(
            response=json.dumps(data),
            mimetype='application/json'
        )

    except Exception as e:
        return app.response_class(
            response=json.dumps({
                "success": "0",
                "error": str(e),
                "trace": traceback.format_exc()
            }),
            mimetype='application/json'
        )

@app.route("/api/iconos/<id>", methods=["GET"])
def iconos_api_get_one(id):
    try:
        repo = IconoRepositoryPgImpl(db)
        use_case = ObtenerIconoUseCase(repo)
        icono = use_case.execute(int(id))

        if icono is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Ícono no encontrado"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "icono": {
                "id": icono.get_id(),
                "nombre": icono.get_nombre()
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
                "error": str(e),
                "trace": traceback.format_exc()
            }),
            mimetype='application/json'
        )

@app.route("/api/iconos/create", methods=["POST"])
def iconos_api_create():
    try:
        data = request.get_json()
        repo = IconoRepositoryPgImpl(db)
        use_case = CrearIconoUseCase(repo)
        nuevo_id = use_case.execute(
            nombre=data["nombre"]
        )

        response = {
            "success": "1",
            "message": "Ícono creado",
            "id": nuevo_id
        }

    except Exception as e:
        response = {
            "success": "0",
            "error": str(e),
            "trace": traceback.format_exc()
        }

    return app.response_class(
        response=json.dumps(response),
        mimetype='application/json'
    )

@app.route("/api/iconos/edit/<id>", methods=["POST"])
def iconos_api_update(id):
    try:
        data = request.get_json()
        repo = IconoRepositoryPgImpl(db)
        use_case = ActualizarIconoUseCase(repo)
        use_case.execute(
            id=int(id),
            nombre=data["nombre"]
        )

        response = {
            "success": "1",
            "message": "Ícono actualizado"
        }

    except Exception as e:
        response = {
            "success": "0",
            "error": str(e),
            "trace": traceback.format_exc()
        }

    return app.response_class(
        response=json.dumps(response),
        mimetype='application/json'
    )

@app.route("/api/iconos/delete/<id>", methods=["POST"])
def iconos_api_delete(id):
    try:
        repo = IconoRepositoryPgImpl(db)
        use_case = EliminarIconoUseCase(repo)
        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Ícono eliminado"
        }

    except Exception as e:
        response = {
            "success": "0",
            "error": str(e),
            "trace": traceback.format_exc()
        }

    return app.response_class(
        response=json.dumps(response),
        mimetype='application/json'
    )

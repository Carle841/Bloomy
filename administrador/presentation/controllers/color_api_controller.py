from flask import json, request
import traceback
from administrador.infrastructure.colores.ColoresRepositoryPgImpl import ColorRepositoryPgImpl
from administrador.application.colores.crear_color_usecase import CrearColorUseCase
from administrador.application.colores.eliminar_color_usecase import EliminarColorUseCase
from administrador.application.colores.obtener_color_usecase import ObtenerColorUseCase
from administrador.application.colores.buscar_color_usecase import BuscarColorUseCase
from administrador.application.colores.actualizar_color_usecase import ActualizarColorUseCase
from administrador import app, db

@app.route("/api/colores", methods=["GET"])
def colores_api_index():
    try:
        filtro = request.args.get("filtro", "")
        repo = ColorRepositoryPgImpl(db)
        use_case = BuscarColorUseCase(repo)
        colores = use_case.execute(filtro)

        data = []
        for color in colores:
            data.append({
                "color_id": color.get_id(),
                "nombre": color.get_nombre(),
                "codigo_hex": color.get_codigo_hex()
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

@app.route("/api/colores/<id>", methods=["GET"])
def colores_api_get_one(id):
    try:
        repo = ColorRepositoryPgImpl(db)
        use_case = ObtenerColorUseCase(repo)
        color = use_case.execute(int(id))

        if color is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Color no encontrado"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "color": {
                "id": color.get_id(),
                "nombre": color.get_nombre(),
                "codigo_hex": color.get_codigo_hex()
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

@app.route("/api/colores/create", methods=["POST"])
def colores_api_create():
    try:
        data = request.get_json()
        repo = ColorRepositoryPgImpl(db)
        use_case = CrearColorUseCase(repo)
        nuevo_id = use_case.execute(
            nombre=data["nombre"],
            codigo_hex=data["codigo_hex"]
        )

        response = {
            "success": "1",
            "message": "Color creado",
            "color_id": nuevo_id
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

@app.route("/api/colores/edit/<id>", methods=["POST"])
def colores_api_update(id):
    try:
        data = request.get_json()
        repo = ColorRepositoryPgImpl(db)
        use_case = ActualizarColorUseCase(repo)
        use_case.execute(
            color_id=int(id),
            nombre=data["nombre"],
            codigo_hex=data["codigo_hex"]
        )

        response = {
            "success": "1",
            "message": "Color actualizado"
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

@app.route("/api/colores/delete/<id>", methods=["POST"])
def colores_api_delete(id):
    try:
        repo = ColorRepositoryPgImpl(db)
        use_case = EliminarColorUseCase(repo)
        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Color eliminado"
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

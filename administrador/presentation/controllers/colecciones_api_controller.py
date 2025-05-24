from flask import request, json
import traceback
from administrador import app, db
from administrador.infrastructure.colecciones.ColeccionRepositoryPgImpl import ColeccionRepositoryPgImpl
from administrador.application.colecciones.crear_coleccion_usecase import CrearColeccionUseCase
from administrador.application.colecciones.obtener_coleccion_usecase import ObtenerColeccionUseCase
from administrador.application.colecciones.buscar_coleccion_usecase import BuscarColeccionUseCase
from administrador.application.colecciones.eliminar_coleccion_usecase import EliminarColeccionUseCase
from administrador.application.colecciones.actualizar_coleccion_usecase import ActualizarColeccionUseCase

@app.route("/api/colecciones", methods=["GET"])
def colecciones_api_index():
    try:
        filtro = request.args.get("filtro", "")
        repo = ColeccionRepositoryPgImpl(db)
        use_case = BuscarColeccionUseCase(repo)
        colecciones = use_case.execute(filtro)

        data = []
        for coleccion in colecciones:
            data.append({
                "id": coleccion.get_id(),
                "nombre": coleccion.get_nombre(),
                "descripcion": coleccion.get_descripcion(),
                "imagen_url": coleccion.get_imagen_url(),
                "estado": coleccion.get_estado(),
                "fecha_creacion": str(coleccion.get_fecha_creacion())
            })

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

@app.route("/api/colecciones/<id>", methods=["GET"])
def colecciones_api_get_one(id):
    try:
        repo = ColeccionRepositoryPgImpl(db)
        use_case = ObtenerColeccionUseCase(repo)
        coleccion = use_case.execute(int(id))

        if coleccion is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Colección no encontrada"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "coleccion": {
                "id": coleccion.get_id(),
                "nombre": coleccion.get_nombre(),
                "descripcion": coleccion.get_descripcion(),
                "imagen_url": coleccion.get_imagen_url(),
                "estado": coleccion.get_estado(),
                "fecha_creacion": str(coleccion.get_fecha_creacion())
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

@app.route("/api/colecciones/create", methods=["POST"])
def colecciones_api_create():
    try:
        repo = ColeccionRepositoryPgImpl(db)
        use_case = CrearColeccionUseCase(repo)

        data = request.get_json()
        use_case.execute(
            nombre=data["nombre"],
            descripcion=data["descripcion"],
            imagen_url=data["imagen_url"],
            estado=data["estado"]
        )

        response = {
            "success": "1",
            "message": "Colección creada correctamente"
        }

    except Exception as e:
        response = {
            "success": "0",
            "error": str(e),
            "traceback": traceback.format_exc()
        }

    return app.response_class(
        response=json.dumps(response),
        mimetype='application/json'
    )

@app.route("/api/colecciones/edit/<id>", methods=["POST"])
def colecciones_api_update(id):
    try:
        repo = ColeccionRepositoryPgImpl(db)
        use_case = ActualizarColeccionUseCase(repo)

        data = request.get_json()
        use_case.execute(
            id=int(id),
            nombre=data["nombre"],
            descripcion=data["descripcion"],
            imagen_url=data["imagen_url"],
            estado=data["estado"]
        )

        response = {
            "success": "1",
            "message": "Colección actualizada correctamente"
        }

    except Exception as e:
        response = {
            "success": "0",
            "error": str(e),
            "traceback": traceback.format_exc()
        }

    return app.response_class(
        response=json.dumps(response),
        mimetype='application/json'
    )

@app.route("/api/colecciones/delete/<id>", methods=["POST"])
def colecciones_api_delete(id):
    try:
        repo = ColeccionRepositoryPgImpl(db)
        use_case = EliminarColeccionUseCase(repo)
        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Colección eliminada"
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

from flask import request, json
import traceback
from administrador.infrastructure.imagenes_productos.ImagenRepositoryPgImpl import ImagenRepositoryPgImpl
from administrador.application.imagenes_productos.crear_imagen_usecase import CrearImagenUseCase
from administrador.application.imagenes_productos.buscar_imagen_usecase import BuscarImagenUseCase
from administrador.application.imagenes_productos.eliminar_imagen_usecase import EliminarImagenUseCase
from administrador.application.imagenes_productos.obtener_imagen_usecase import ObtenerImagenUseCase
from administrador.application.imagenes_productos.actualizar_imagen_usecase import ActualizarImagenUseCase
from administrador import app, db

@app.route("/api/imagenes/create", methods=["POST"])
def imagenes_api_create():
    try:
        data = request.get_json()
        producto_id = data["producto_id"]
        url = data["url"]

        repo = ImagenRepositoryPgImpl(db)
        use_case = CrearImagenUseCase(repo)
        nuevo_id = use_case.execute(
            producto_id=producto_id,
            url=url
        )

        response = {
            "success": "1",
            "message": "Imagen creada",
            "imagen_id": nuevo_id
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

@app.route("/api/imagenes/<id>", methods=["GET"])
def imagenes_api_get_one(id):
    try:
        repo = ImagenRepositoryPgImpl(db)
        use_case = ObtenerImagenUseCase(repo)
        imagen = use_case.execute(int(id))

        if imagen is None:
            return app.response_class(
                response=json.dumps({"success": "0", "error": "Imagen no encontrada"}),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "imagen": {
                "id": imagen.get_id(),
                "producto_id": imagen.get_producto_id(),
                "url": imagen.get_url()
            }
        }
        return app.response_class(response=json.dumps(data), mimetype='application/json')

    except Exception as e:
        return app.response_class(
            response=json.dumps({"success": "0", "error": str(e), "trace": traceback.format_exc()}),
            mimetype='application/json'
        )


@app.route("/api/imagenes", methods=["GET"])
def imagenes_api_index():
    try:
        filtro = request.args.get("filtro", "")
        repo = ImagenRepositoryPgImpl(db)
        use_case = BuscarImagenUseCase(repo)
        imagenes = use_case.execute(filtro)

        data = [
            {
                "id": i.get_id(),
                "producto_id": i.get_producto_id(),
                "url": i.get_url()
            } for i in imagenes
        ]

        return app.response_class(response=json.dumps(data), mimetype='application/json')

    except Exception as e:
        return app.response_class(
            response=json.dumps({"success": "0", "error": str(e), "trace": traceback.format_exc()}),
            mimetype='application/json'
        )


@app.route("/api/imagenes/delete/<id>", methods=["POST"])
def imagenes_api_delete(id):
    try:
        repo = ImagenRepositoryPgImpl(db)
        use_case = EliminarImagenUseCase(repo)
        use_case.execute(int(id))

        return app.response_class(
            response=json.dumps({"success": "1", "message": "Imagen eliminada"}),
            mimetype='application/json'
        )

    except Exception as e:
        return app.response_class(
            response=json.dumps({"success": "0", "error": str(e), "trace": traceback.format_exc()}),
            mimetype='application/json'
        )

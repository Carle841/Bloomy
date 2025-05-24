from flask import request, json
import traceback
from administrador import app, db

from administrador.infrastructure.colecciones_categorias.ColeccionCategoriaRepositoryPgImpl import ColeccionCategoriaRepositoryPgImpl
from administrador.application.colecciones_categorias.crear_coleccion_categoria_usecase import CrearColeccionCategoriaUseCase
from administrador.application.colecciones_categorias.obtener_coleccion_categoria_usecase import ObtenerColeccionCategoriaUseCase
from administrador.application.colecciones_categorias.eliminar_coleccion_categoria_usecase import EliminarColeccionCategoriaUseCase

@app.route("/api/colecciones-categorias/<coleccion_id>", methods=["GET"])
def coleccion_categoria_api_by_coleccion(coleccion_id):
    try:
        repo = ColeccionCategoriaRepositoryPgImpl(db)
        use_case = ObtenerColeccionCategoriaUseCase(repo)

        relaciones = use_case.execute(int(coleccion_id))

        data = []
        for relacion in relaciones:
            data.append({
                "coleccion_id": relacion.get_coleccion_id(),
                "categoria_id": relacion.get_categoria_id()
            })

        return app.response_class(
            response=json.dumps({
                "success": "1",
                "relaciones": data
            }),
            mimetype='application/json'
        )
    except Exception as e:
        return app.response_class(
            response=json.dumps({
                "success": "0",
                "error": str(e),
                "traceback": traceback.format_exc()
            }),
            mimetype='application/json'
        )


@app.route("/api/colecciones-categorias/create", methods=["POST"])
def coleccion_categoria_api_create():
    try:
        repo = ColeccionCategoriaRepositoryPgImpl(db)
        use_case = CrearColeccionCategoriaUseCase(repo)
        data = request.get_json()

        use_case.execute(
            coleccion_id=int(data["coleccion_id"]),
            categoria_id=int(data["categoria_id"])
        )

        return app.response_class(
            response=json.dumps({
                "success": "1",
                "message": "Relación creada correctamente"
            }),
            mimetype='application/json'
        )

    except Exception as e:
        return app.response_class(
            response=json.dumps({
                "success": "0",
                "error": str(e),
                "traceback": traceback.format_exc()
            }),
            mimetype='application/json'
        )

@app.route("/api/colecciones-categorias/delete/<coleccion_id>/<categoria_id>", methods=["POST"])
def coleccion_categoria_api_delete(coleccion_id, categoria_id):
    try:
        repo = ColeccionCategoriaRepositoryPgImpl(db)
        use_case = EliminarColeccionCategoriaUseCase(repo)

        use_case.execute(int(coleccion_id), int(categoria_id))

        return app.response_class(
            response=json.dumps({
                "success": "1",
                "message": "Relación eliminada correctamente"
            }),
            mimetype='application/json'
        )

    except Exception as e:
        return app.response_class(
            response=json.dumps({
                "success": "0",
                "error": str(e),
                "traceback": traceback.format_exc()
            }),
            mimetype='application/json'
        )

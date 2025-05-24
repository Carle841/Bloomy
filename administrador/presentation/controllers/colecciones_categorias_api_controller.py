from flask import request, json
import traceback
from administrador import app, db

from administrador.infrastructure.colecciones_categorias.ColeccionCategoriaRepositoryPgImpl import ColeccionCategoriaRepositoryPgImpl
from administrador.application.colecciones_categorias.crear_coleccion_categoria_usecase import CrearColeccionCategoriaUseCase
from administrador.application.colecciones_categorias.obtener_coleccion_categoria_usecase import ObtenerColeccionCategoriaUseCase
from administrador.application.colecciones_categorias.eliminar_coleccion_categoria_usecase import EliminarColeccionCategoriaUseCase
from administrador.application.colecciones_categorias.contar_categorias_en_coleccion_usecase import ContarCategoriasEnColeccionUseCase

@app.route("/api/colecciones-categorias/<coleccion_id>", methods=["GET"])
def coleccion_categoria_api_by_coleccion(coleccion_id):
    try:
        repo = ColeccionCategoriaRepositoryPgImpl(db)
        use_case = ObtenerColeccionCategoriaUseCase(repo)

        relaciones = use_case.execute(int(coleccion_id))

        data = []
        for relacion in relaciones:
            data.append({
                "coleccion_id": relacion["coleccion_id"],
                "categoria_id": relacion["categoria_id"],
                "categoria_nombre": relacion["categoria_nombre"]
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

@app.route("/api/colecciones-categorias/count/<coleccion_id>", methods=["GET"])
def coleccion_categoria_api_count(coleccion_id):
    try:
        repo = ColeccionCategoriaRepositoryPgImpl(db)
        use_case = ContarCategoriasEnColeccionUseCase(repo)

        total = use_case.execute(int(coleccion_id))

        return app.response_class(
            response=json.dumps({
                "success": "1",
                "coleccion_id": int(coleccion_id),
                "total_categorias": total
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
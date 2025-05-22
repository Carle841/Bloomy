from flask import json, request
from flask import render_template, json, request, redirect, url_for, flash
import traceback
from administrador.domain.categorias.categoria import Categoria
from administrador.domain.categorias import categoria_repository_port
from administrador.domain.categorias import categoria_service
from administrador.infrastructure.categorias.CategoriasRepositoryPgImpl import CategoriaRepositoryPgImpl
from administrador.application.categorias.crear_categoria_usecase import CrearCategoriaUseCase
from administrador.application.categorias.eliminar_categoria_usecase import EliminarCategoriaUseCase
from administrador.application.categorias.obtener_categoria_usecase import ObtenerCategoriaUseCase
from administrador.application.categorias.buscar_categoria_usecase import BuscarCategoriaUseCase
from administrador.application.categorias.actualizar_categoria_usecase import ActualizarCategoriaUseCase
from administrador.application.categorias.buscar_categoria_detallada_usecase import BuscarCategoriaDetalladaUseCase
from administrador import app, db

@app.route("/categorias2", methods=["GET"])
def categorias_index2():
    return  "categoriasdfsdafsdafdsaf"


@app.route("/api/categorias/create", methods=["POST"])
def categorias_api_create():
    categoria_repository = CategoriaRepositoryPgImpl(db)
    caso_uso = CrearCategoriaUseCase(categoria_repository)

    data = request.json

    try:
        nuevo_id = caso_uso.execute(
            nombre=data["nombre"],
            descripcion=data["descripcion"],
            icono_id=int(data["icono_id"]),
            color_id=int(data["color_id"])
        )

        response = {
            "success": "1",
            "message": "Categoría creada",
            "id": nuevo_id
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

@app.route("/api/categorias/delete/<id>", methods=["POST"])
def categorias_api_delete(id):
    try:
        repo = CategoriaRepositoryPgImpl(db)
        use_case = EliminarCategoriaUseCase(repo)
        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Categoría eliminada"
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

@app.route("/api/categorias", methods=["GET"])
def categorias_api_index():
    try:
        filtro = request.args.get("filtro", "")
        repo = CategoriaRepositoryPgImpl(db)
        use_case = BuscarCategoriaUseCase(repo)
        categorias = use_case.execute(filtro)

        data = []
        for categoria in categorias:
            data.append({
                "id": categoria.get_id(),
                "nombre": categoria.get_nombre(),
                "descripcion": categoria.get_descripcion(),
                "icono_id": categoria.get_icono_id(),
                "color_id": categoria.get_color_id()
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

@app.route("/api/categorias/<id>", methods=["GET"])
def categorias_api_get_one(id):
    try:
        repo = CategoriaRepositoryPgImpl(db)
        use_case = ObtenerCategoriaUseCase(repo)
        categoria = use_case.execute(int(id))

        if categoria is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Categoría no encontrada"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "categoria": {
                "id": categoria.get_id(),
                "nombre": categoria.get_nombre(),
                "descripcion": categoria.get_descripcion(),
                "icono_id": categoria.get_icono_id(),
                "color_id": categoria.get_color_id()
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

@app.route("/api/categorias/edit/<id>", methods=["POST"])
def categorias_api_update(id):
    try:
        repo = CategoriaRepositoryPgImpl(db)
        use_case = ActualizarCategoriaUseCase(repo)

        data = request.get_json()
        use_case.execute(
            id=int(id),
            nombre=data["nombre"],
            descripcion=data["descripcion"],
            icono_id=int(data["icono_id"]),
            color_id=int(data["color_id"])
        )

        response = {
            "success": "1",
            "message": "Categoría actualizada"
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
    

@app.route("/api/categorias/detalladas", methods=["GET"])
def categorias_api_detalladas():
    try:
        repo = CategoriaRepositoryPgImpl(db)
        use_case = BuscarCategoriaDetalladaUseCase(repo)
        categorias = use_case.execute()

        return app.response_class(
            response=json.dumps(categorias),
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


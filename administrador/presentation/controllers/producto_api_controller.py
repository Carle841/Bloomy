from flask import json, request
import traceback
from administrador.application.productos.crear_producto_usecase import CrearProductoUseCase
from administrador.infrastructure.productos.ProductosRepositoryPgImpl import ProductoRepositoryPgImpl
from administrador.application.productos.actualizar_producto_usecase import ActualizarProductoUseCase
from administrador.application.productos.eliminar_producto_usecase import EliminarProductoUseCase
from administrador.application.productos.obtener_producto_usecase import ObtenerProductoUseCase
from administrador.application.productos.buscar_producto_usecase import BuscarProductoUseCase
from administrador import app, db

@app.route("/api/productos/create", methods=["POST"])
def productos_api_create():
    try:
        data = request.get_json()
        repo = ProductoRepositoryPgImpl(db)
        use_case = CrearProductoUseCase(repo)
        nuevo_id = use_case.execute(
            nombre=data["nombre"],
            codigo=data["codigo"],
            categoria_id=data["categoria_id"],
            precio=data["precio"],
            stock=data["stock"],
            estado=data["estado"],
            descripcion=data["descripcion"]
        )

        response = {
            "success": "1",
            "message": "Producto creado",
            "producto_id": nuevo_id
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

@app.route("/api/productos/edit/<id>", methods=["POST"])
def productos_api_update(id):
    try:
        data = request.get_json()
        repo = ProductoRepositoryPgImpl(db)
        use_case = ActualizarProductoUseCase(repo)
        use_case.execute(
            id=int(id),
            nombre=data["nombre"],
            codigo=data["codigo"],
            categoria_id=data["categoria_id"],
            precio=data["precio"],
            stock=data["stock"],
            estado=data["estado"],
            descripcion=data.get("descripcion", "")
        )

        response = {
            "success": "1",
            "message": "Producto actualizado"
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

@app.route("/api/productos/<id>", methods=["GET"])
def productos_api_get_one(id):
    try:
        repo = ProductoRepositoryPgImpl(db)
        use_case = ObtenerProductoUseCase(repo)
        producto = use_case.execute(int(id))

        if producto is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Producto no encontrado"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "producto": {
                "id": producto.get_id(),
                "nombre": producto.get_nombre(),
                "codigo": producto.get_codigo(),
                "categoria_id": producto.get_categoria_id(),
                "precio": producto.get_precio(),
                "stock": producto.get_stock(),
                "estado": producto.get_estado(),
                "descripcion": producto.get_descripcion()
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

@app.route("/api/productos", methods=["GET"])
def productos_api_index():
    try:
        filtro = request.args.get("filtro", "")
        repo = ProductoRepositoryPgImpl(db)
        use_case = BuscarProductoUseCase(repo)
        productos = use_case.execute(filtro)

        data = []
        for producto in productos:
            data.append({
                "producto_id": producto.get_id(),
                "nombre": producto.get_nombre(),
                "codigo": producto.get_codigo(),
                "categoria_id": producto.get_categoria_id(),
                "precio": producto.get_precio(),
                "stock": producto.get_stock(),
                "estado": producto.get_estado(),
                "descripcion": producto.get_descripcion()
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

@app.route("/api/productos/delete/<id>", methods=["POST"])
def productos_api_delete(id):
    try:
        repo = ProductoRepositoryPgImpl(db)
        use_case = EliminarProductoUseCase(repo)
        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Producto eliminado"
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
    
from flask import json, request
from administrador.domain.inventario.inventario import Inventario
from administrador.infrastructure.proveedores.ProveedoresRepositoryPgImpl import ProveedoresRepositoryPgImpl
from administrador.infrastructure.inventario.InventariosRepositoryPgImpl import InventariosRepositoryPgImpl
from administrador.application.inventario.crear_inventario_usecase import CrearInventarioUseCase
from administrador.application.inventario.eliminar_inventario_usecase import EliminarInventarioUseCase
from administrador.application.inventario.obtener_inventario_usecase import ObtenerInventarioUseCase
from administrador.application.inventario.buscar_inventario_usecase import BuscarInventarioUseCase
from administrador.application.inventario.actualizar_inventario_usecase import ActualizarInventarioUseCase
from administrador.application.inventario.listar_inventario_por_proveedor_usecase import ListarInventarioPorProveedorUseCase
from administrador import app, db

@app.route("/api/inventario/create", methods=["POST"])
def inventario_api_create():
    repo = InventariosRepositoryPgImpl(db)
    use_case = CrearInventarioUseCase(repo)

    data = request.json
    try:
        nuevo_id = use_case.execute(
            nombre=data["nombre"],
            descripcion=data["descripcion"],
            precio=data["precio"],
            proveedor_id=data["proveedor_id"]
        )
        response = {
            "success": "1",
            "message": "Inventario creado",
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

@app.route("/api/inventario/delete/<id>", methods=["POST"])
def inventario_api_delete(id):
    try:
        repo = InventariosRepositoryPgImpl(db)
        use_case = EliminarInventarioUseCase(repo)
        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Inventario eliminado"
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

@app.route("/api/inventario", methods=["GET"])
def inventario_api_index():
    try:
        filtro = request.args.get("filtro", "")
        repo = InventariosRepositoryPgImpl(db)
        use_case = BuscarInventarioUseCase(repo)
        inventarios = use_case.execute(filtro)

        data = []
        for item in inventarios:
            data.append({
                "id": item.get_id(),
                "nombre": item.get_nombre(),
                "descripcion": item.get_descripcion(),
                "precio": item.get_precio(),
                "proveedor_id": item.get_proveedor_id()
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

@app.route("/api/inventario/<id>", methods=["GET"])
def inventario_api_get_one(id):
    try:
        repo = InventariosRepositoryPgImpl(db)
        use_case = ObtenerInventarioUseCase(repo)
        item = use_case.execute(int(id))

        if item is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Inventario no encontrado"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "inventario": {
                "id": item.get_id(),
                "nombre": item.get_nombre(),
                "descripcion": item.get_descripcion(),
                "precio": item.get_precio(),
                "proveedor_id": item.get_proveedor_id()
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

@app.route("/api/inventario/edit/<id>", methods=["POST"])
def inventario_api_update(id):
    try:
        repo = InventariosRepositoryPgImpl(db)
        use_case = ActualizarInventarioUseCase(repo)

        data = request.get_json()
        use_case.execute(
            id=int(id),
            nombre=data["nombre"],
            descripcion=data["descripcion"],
            precio=data["precio"],
            proveedor_id=data["proveedor_id"]
        )

        response = {
            "success": "1",
            "message": "Inventario actualizado"
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

@app.route("/api/inventario/por_proveedor/<proveedor_id>", methods=["GET"])
def inventario_por_proveedor(proveedor_id):
    try:
        inventario_repo = InventariosRepositoryPgImpl(db)
        proveedor_repo = ProveedoresRepositoryPgImpl(db)
        use_case = ListarInventarioPorProveedorUseCase(inventario_repo, proveedor_repo)
        
        inventarios, nombre_proveedor = use_case.execute(int(proveedor_id))

        data = []
        for inv in inventarios:
            data.append({
                "id": inv.get_id(),
                "nombre": inv.get_nombre(),
                "descripcion": inv.get_descripcion(),
                "precio": float(inv.get_precio()),
                "nombre_proveedor": nombre_proveedor
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
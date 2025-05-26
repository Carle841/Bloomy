from flask import json, request
from administrador import app, db
from administrador.infrastructure.combos_productos.CombosProductosRepositoryPgImpl import ComboProductoRepository
from administrador.infrastructure.productos.ProductosRepositoryPgImpl import ProductoRepositoryPgImpl
from administrador.infrastructure.combos.CombosRepositoryPgImpl import CombosRepositoryPgImpl
from administrador.application.combos_productos.crear_combo_producto_usecase import CrearComboProductoUseCase
from administrador.application.combos_productos.actualizar_combo_producto_usecase import ActualizarComboProductoUseCase
from administrador.application.combos_productos.buscar_combo_producto_usecase import BuscarComboProductoUseCase
from administrador.application.combos_productos.obtener_combo_producto_usecase import ObtenerComboProductoUseCase
from administrador.application.combos_productos.eliminar_combo_producto_usecase import EliminarComboProductoUseCase

@app.route("/api/combos-productos/create", methods=["POST"])
def combos_productos_api_create():
    combo_producto_repo = ComboProductoRepository(db)
    producto_repo = ProductoRepositoryPgImpl(db)
    combo_repo = CombosRepositoryPgImpl(db)
    use_case = CrearComboProductoUseCase(combo_producto_repo, producto_repo, combo_repo)
    data = request.json

    try:
        # Validar campos requeridos
        required_fields = ["combo_id", "producto_id", "cantidad"]
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Campo requerido: {field}")

        use_case.execute(
            combo_id=int(data["combo_id"]),
            producto_id=int(data["producto_id"]),
            cantidad=int(data["cantidad"])
        )

        response = {
            "success": "1",
            "message": "ComboProducto creado",
            "combo_id": int(data["combo_id"]),
            "producto_id": int(data["producto_id"])
        }
    except Exception as e:
        response = {"success": "0", "error": str(e)}

    return app.response_class(
        response=json.dumps(response),
        mimetype='application/json'
    )

@app.route("/api/combos-productos/update", methods=["POST"])
def combos_productos_api_update():
    combo_producto_repo = ComboProductoRepository(db)
    producto_repo = ProductoRepositoryPgImpl(db)
    combo_repo = CombosRepositoryPgImpl(db)
    use_case = ActualizarComboProductoUseCase(combo_producto_repo, producto_repo, combo_repo)
    data = request.json

    try:
        # Validar campos requeridos
        required_fields = ["combo_id", "producto_id", "cantidad"]
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Campo requerido: {field}")

        use_case.execute(
            combo_id=int(data["combo_id"]),
            producto_id=int(data["producto_id"]),
            cantidad=int(data["cantidad"])
        )

        response = {
            "success": "1",
            "message": "ComboProducto actualizado",
            "combo_id": int(data["combo_id"]),
            "producto_id": int(data["producto_id"])
        }
    except Exception as e:
        response = {"success": "0", "error": str(e)}

    return app.response_class(
        response=json.dumps(response),
        mimetype='application/json'
    )

@app.route("/api/combos-productos/<int:combo_id>", methods=["GET"])
def combos_productos_api_find(combo_id):
    combo_producto_repo = ComboProductoRepository(db)
    use_case = BuscarComboProductoUseCase(combo_producto_repo)

    try:
        combo_productos = use_case.execute(combo_id)
        data = [
            {
                "combo_id": cp.get_combo_id(),
                "producto_id": cp.get_producto_id(),
                "cantidad": cp.get_cantidad(),
                "subtotal": cp.get_subtotal()
            } for cp in combo_productos
        ]

        return app.response_class(
            response=json.dumps(data),
            mimetype='application/json'
        )
    except Exception as e:
        response = {"success": "0", "error": str(e)}
        return app.response_class(
            response=json.dumps(response),
            mimetype='application/json'
        )

@app.route("/api/combos-productos/<int:combo_id>/<int:producto_id>", methods=["GET"])
def combos_productos_api_get(combo_id, producto_id):
    combo_producto_repo = ComboProductoRepository(db)
    use_case = ObtenerComboProductoUseCase(combo_producto_repo)

    try:
        combo_producto = use_case.execute(combo_id, producto_id)
        data = {
            "success": "1",
            "combo_producto": {
                "combo_id": combo_producto.get_combo_id(),
                "producto_id": combo_producto.get_producto_id(),
                "cantidad": combo_producto.get_cantidad(),
                "subtotal": combo_producto.get_subtotal()
            }
        }
        return app.response_class(
            response=json.dumps(data),
            mimetype='application/json'
        )
    except Exception as e:
        response = {"success": "0", "error": str(e)}
        return app.response_class(
            response=json.dumps(response),
            mimetype='application/json'
        )

@app.route("/api/combos-productos/delete/<int:combo_id>/<int:producto_id>", methods=["POST"])
def combos_productos_api_delete(combo_id, producto_id):
    combo_producto_repo = ComboProductoRepository(db)
    combo_repo = CombosRepositoryPgImpl(db)
    use_case = EliminarComboProductoUseCase(combo_producto_repo, combo_repo)

    try:
        use_case.execute(combo_id, producto_id)
        response = {
            "success": "1",
            "message": "ComboProducto eliminado"
        }
    except Exception as e:
        response = {"success": "0", "error": str(e)}

    return app.response_class(
        response=json.dumps(response),
        mimetype='application/json'
    )
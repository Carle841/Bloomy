from flask import json, request
from administrador.domain.proveedores.proveedor import Proveedor
from administrador.infrastructure.proveedores.ProveedoresRepositoryPgImpl import ProveedoresRepositoryPgImpl
from administrador.application.proveedores.crear_proveedor_usecase import CrearProveedorUseCase
from administrador.application.proveedores.eliminar_proveedor_usecase import EliminarProveedorUseCase
from administrador.application.proveedores.obtener_proveedor_usecase import ObtenerProveedorUseCase
from administrador.application.proveedores.buscar_proveedor_usecase import BuscarProveedorUseCase
from administrador.application.proveedores.actualizar_proveedor_usecase import ActualizarProveedorUseCase
from administrador import app, db

@app.route("/api/proveedores/create", methods=["POST"])
def proveedores_api_create():
    repo = ProveedoresRepositoryPgImpl(db)
    use_case = CrearProveedorUseCase(repo)

    data = request.json
    try:
        nuevo_id = use_case.execute(
            nombre=data["nombre"],
            contacto=data["contacto"],
            telefono=data["telefono"],
            email=data["email"],
            direccion=data["direccion"]
        )
        response = {
            "success": "1",
            "message": "Proveedor creado",
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

@app.route("/api/proveedores/delete/<id>", methods=["POST"])
def proveedores_api_delete(id):
    try:
        repo = ProveedoresRepositoryPgImpl(db)
        use_case = EliminarProveedorUseCase(repo)
        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Proveedor eliminado"
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

@app.route("/api/proveedores", methods=["GET"])
def proveedores_api_index():
    try:
        filtro = request.args.get("filtro", "")
        repo = ProveedoresRepositoryPgImpl(db)
        use_case = BuscarProveedorUseCase(repo)
        proveedores = use_case.execute(filtro)

        data = []
        for proveedor in proveedores:
            data.append({
                "id": proveedor.get_id(),
                "nombre": proveedor.get_nombre(),
                "contacto": proveedor.get_contacto(),
                "telefono": proveedor.get_telefono(),
                "email": proveedor.get_email(),
                "direccion": proveedor.get_direccion()
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

@app.route("/api/proveedores/<id>", methods=["GET"])
def proveedores_api_get_one(id):
    try:
        repo = ProveedoresRepositoryPgImpl(db)
        use_case = ObtenerProveedorUseCase(repo)
        proveedor = use_case.execute(int(id))

        if proveedor is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Proveedor no encontrado"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "proveedor": {
                "id": proveedor.get_id(),
                "nombre": proveedor.get_nombre(),
                "contacto": proveedor.get_contacto(),
                "telefono": proveedor.get_telefono(),
                "email": proveedor.get_email(),
                "direccion": proveedor.get_direccion()
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

@app.route("/api/proveedores/edit/<id>", methods=["POST"])
def proveedores_api_update(id):
    try:
        repo = ProveedoresRepositoryPgImpl(db)
        use_case = ActualizarProveedorUseCase(repo)

        data = request.get_json()
        use_case.execute(
            id=int(id),
            nombre=data["nombre"],
            contacto=data["contacto"],
            telefono=data["telefono"],
            email=data["email"],
            direccion=data["direccion"]
        )

        response = {
            "success": "1",
            "message": "Proveedor actualizado"
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

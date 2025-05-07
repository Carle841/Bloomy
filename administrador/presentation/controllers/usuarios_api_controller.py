from flask import json, request
from administrador.domain.usuarios.usuarios import Usuario
from administrador.infrastructure.usuarios.UsuariosRepositoryPgImpl import UsuarioRepositoryPgImpl
from administrador.application.usuarios.crear_usuario_use_case import CrearUsuarioUseCase
from administrador.application.usuarios.eliminar_usuario_use_case import EliminarUsuarioUseCase
from administrador.application.usuarios.obtener_usuario_use_case import ObtenerUsuarioUseCase
from administrador.application.usuarios.buscar_usuario_use_case import BuscarUsuariosUseCase
from administrador.application.usuarios.actualizar_usuario_use_case import ActualizarUsuarioUseCase
from administrador import app, db
from datetime import datetime

@app.route("/api/usuarios/create", methods=["POST"])
def usuarios_api_create():
    usuarios_repository = UsuarioRepositoryPgImpl(db)
    caso_uso = CrearUsuarioUseCase(usuarios_repository)

    data = request.json

    try:
        nuevo_id = caso_uso.execute(
            nombre=data["nombre"],
            email=data["email"],
            id_rol=int(data["id_rol"]),
            estado=data["estado"],
            telefono=data["telefono"],
            contraseña=data["contraseña"]
        )

        response = {
            "success": "1",
            "message": "Usuario creado",
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

@app.route("/api/usuarios/delete/<id>", methods=["POST"])
def usuarios_api_delete(id):
    try:
        repo = UsuarioRepositoryPgImpl(db)
        use_case = EliminarUsuarioUseCase(repo)
        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Usuario eliminado"
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

@app.route("/api/usuarios", methods=["GET"])
def usuarios_api_index():
    try:
        filtro = request.args.get("filtro", "")
        repo = UsuarioRepositoryPgImpl(db)
        use_case = BuscarUsuariosUseCase(repo)
        usuarios = use_case.execute(filtro)

        data = []
        for usuario in usuarios:
            data.append({
                "id": usuario.get_id(),
                "nombre": usuario.get_nombre(),
                "email": usuario.get_email(),
                "rol": usuario.get_rol(),  # ya es el nombre
                "estado": usuario.get_estado(),
                "ultimo_acceso": str(usuario.get_ultimo_acceso()),
                "fecha_registro": str(usuario.get_fecha_registro()),
                "telefono": usuario.get_telefono(),
                "contraseña": usuario.get_contraseña()
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

@app.route("/api/usuarios/<id>", methods=["GET"])
def usuarios_api_get_one(id):
    try:
        repo = UsuarioRepositoryPgImpl(db)
        use_case = ObtenerUsuarioUseCase(repo)
        usuario = use_case.execute(int(id))

        if usuario is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Usuario no encontrado"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "usuario": {
                "id": usuario.get_id(),
                "nombre": usuario.get_nombre(),
                "email": usuario.get_email(),
                "rol": usuario.get_rol(),
                "estado": usuario.get_estado(),
                "ultimo_acceso": str(usuario.get_ultimo_acceso()),
                "fecha_registro": str(usuario.get_fecha_registro()),
                "telefono": usuario.get_telefono(),
                "contraseña": usuario.get_contraseña()
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

@app.route("/api/usuarios/edit/<id>", methods=["POST"])
def usuarios_api_update(id):
    try:
        repo = UsuarioRepositoryPgImpl(db)
        use_case = ActualizarUsuarioUseCase(repo)

        data = request.get_json()
        use_case.execute(
            id=int(id),
            nombre=data["nombre"],
            email=data["email"],
            id_rol=int(data["id_rol"]),
            estado=data["estado"],
            telefono=data["telefono"],
            contraseña=data["contraseña"]
        )

        response = {
            "success": "1",
            "message": "Usuario actualizado"
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

from flask import json, request
from administrador.infrastructure.usuarios.UsuariosRepositoryPgImpl import UsuarioRepositoryPgImpl
from administrador.domain.usuarios.usuario_service import UsuarioService
from administrador.domain.usuarios.usuarios import Usuario
from administrador import app, db
from datetime import datetime


@app.route("/api/usuarios/create", methods=["POST"])
def usuarios_api_create():
    usuarios_repository = UsuarioRepositoryPgImpl(db)
    usuarioService = UsuarioService(usuarios_repository)
    usuario_id = usuarioService.get_next_id()

    usuario = Usuario(
        id=usuario_id,
        nombre=request.json["nombre"],
        email=request.json["email"],
        id_rol=int(request.json["id_rol"]),  # aquí va el nombre del rol, no el id
        estado=request.json["estado"],
        ultimo_acceso=datetime.now(),
        fecha_registro=datetime.now(),
        telefono=request.json["telefono"],
        contraseña=request.json["contraseña"]
    )

    usuarioService.add(usuario)

    data = {
        "success": "1",
        "message": "Usuario creado"
    }
    return app.response_class(
        response=json.dumps(data),
        mimetype='application/json'
    )


@app.route("/api/usuarios/delete/<id>", methods=["POST"])
def usuarios_api_delete(id):
    usuarios_repository = UsuarioRepositoryPgImpl(db)
    usuarioService = UsuarioService(usuarios_repository)
    usuario = usuarioService.get_by_id(int(id))
    usuarioService.remove(usuario.get_id())
    data = {
        "success": "1",
        "message": "Usuario eliminado"
    }
    return app.response_class(
        response=json.dumps(data),
        mimetype='application/json'
    )


@app.route("/api/usuarios", methods=["GET"])
def usuarios_api_index():
    usuarios_repository = UsuarioRepositoryPgImpl(db)
    usuarioService = UsuarioService(usuarios_repository)
    usuarios = usuarioService.find_all("")

    data = []
    for usuario in usuarios:
        data.append({
            "id": usuario.get_id(),
            "nombre": usuario.get_nombre(),
            "email": usuario.get_email(),
            "rol": usuario.get_rol(),  # ya es el nombre, no el id
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


@app.route("/api/usuarios/<id>", methods=["GET"])
def usuarios_api_get_one(id):
    usuarios_repository = UsuarioRepositoryPgImpl(db)
    usuarioService = UsuarioService(usuarios_repository)
    usuario = usuarioService.get_by_id(int(id))

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
            "contrasena": usuario.get_contraseña()
        }
    }
    return app.response_class(
        response=json.dumps(data),
        mimetype='application/json'
    )


@app.route("/api/usuarios/edit/<id>", methods=["POST"])
def usuarios_api_update(id):
    usuarios_repository = UsuarioRepositoryPgImpl(db)
    usuarioService = UsuarioService(usuarios_repository)
    usuario = usuarioService.get_by_id(int(id))

    if request.method == "POST":
        usuario.set_nombre(request.json["nombre"])
        usuario.set_email(request.json["email"])
        usuario.set_rol(int(request.json["id_rol"]))
        usuario.set_estado(request.json["estado"])
        usuario.set_telefono(request.json["telefono"])
        usuario.set_contraseña(request.json["contraseña"])
        usuario.set_ultimo_acceso(datetime.now())
        usuarioService.update(usuario)

        data = {
            "success": "1",
            "message": "Usuario actualizado"
        }
        return app.response_class(
            response=json.dumps(data),
            mimetype='application/json'
        )

from flask import json
from administrador.infrastructure.usuarios.UsuariosRepositoryPgImpl import UsuarioRepositoryPgImpl
from administrador.infrastructure.proveedores.ProveedoresRepositoryPgImpl import ProveedoresRepositoryPgImpl
from administrador import app, db

@app.route("/api/contar", methods=["GET"])
def dashboard_contar():
    try:
        repo_usuarios = UsuarioRepositoryPgImpl(db)
        repo_proveedores = ProveedoresRepositoryPgImpl(db)

        conteo_roles = repo_usuarios.count_by_roles()
        total_usuarios = repo_usuarios.count_all()
        total_proveedores = repo_proveedores.count_all()
        total_general = total_usuarios + total_proveedores

        data = {
            "usuarios": {
                "total": total_usuarios,
                "administradores": conteo_roles.get("administradores", 0),
                "clientes": conteo_roles.get("clientes", 0)
            },
            "proveedores": {
                "total": total_proveedores
            },
            "total_general": total_general
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

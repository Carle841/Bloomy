from flask import json, request
import traceback 
import os
import uuid
from werkzeug.utils import secure_filename
from administrador.domain.iconos.icono import Icono
from administrador.infrastructure.iconos.IconosRepositoryPgImpl import IconoRepositoryPgImpl
from administrador.application.iconos.crear_icono_usecase import CrearIconoUseCase
from administrador.application.iconos.eliminar_icono_usecase import EliminarIconoUseCase
from administrador.application.iconos.obtener_icono_usecase import ObtenerIconoUseCase
from administrador.application.iconos.buscar_icono_usecase import BuscarIconoUseCase
from administrador.application.iconos.actualizar_icono_usecase import ActualizarIconoUseCase
from administrador import app, db

@app.route("/api/iconos", methods=["GET"])
def iconos_api_index():
    try:
        filtro = request.args.get("filtro", "")
        repo = IconoRepositoryPgImpl(db)
        use_case = BuscarIconoUseCase(repo)
        iconos = use_case.execute(filtro)

        data = []
        for icono in iconos:
            data.append({
                "icono_id": icono.get_id(),
                "nombre": icono.get_nombre(),
                "url": icono.get_url()
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

@app.route("/api/iconos/<id>", methods=["GET"])
def iconos_api_get_one(id):
    try:
        repo = IconoRepositoryPgImpl(db)
        use_case = ObtenerIconoUseCase(repo)
        icono = use_case.execute(int(id))

        if icono is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Ícono no encontrado"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "icono": {
                "id": icono.get_id(),
                "nombre": icono.get_nombre(),
                "url": icono.get_url()
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

@app.route("/api/iconos/create", methods=["POST"])
def iconos_api_create():
    try:
        data = request.get_json()
        repo = IconoRepositoryPgImpl(db)
        use_case = CrearIconoUseCase(repo)
        nuevo_id = use_case.execute(
            nombre=data["nombre"],
            url=data["url"]
        )

        response = {
            "success": "1",
            "message": "Ícono creado",
            "id": nuevo_id
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

@app.route("/api/iconos/edit/<id>", methods=["POST"])
def iconos_api_update(id):
    try:
        data = request.get_json()
        repo = IconoRepositoryPgImpl(db)
        use_case = ActualizarIconoUseCase(repo)
        use_case.execute(
            id=int(id),
            nombre=data["nombre"],
            url=data["url"]
        )

        response = {
            "success": "1",
            "message": "Ícono actualizado"
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

@app.route("/api/iconos/delete/<id>", methods=["POST"])
def iconos_api_delete(id):
    try:
        repo = IconoRepositoryPgImpl(db)
        use_case = EliminarIconoUseCase(repo)
        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Ícono eliminado"
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

# Configuración del directorio para guardar imágenes
UPLOAD_FOLDER = r'D:\UNIVERSIDAD\2025\1-2025\Arquitectura de Software\Proyecto\BloomyArt\administrador\presentation\static\img\iconos'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Asegura que el directorio exista
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/api/iconos/upload", methods=["POST"])
def iconos_api_upload():
    try:
        if 'imagen' not in request.files:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "No se proporcionó ninguna imagen"
                }),
                mimetype='application/json'
            )
        file = request.files['imagen']
        if file.filename == '':
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "No se seleccionó ningún archivo"
                }),
                mimetype='application/json'
            )
        if file and allowed_file(file.filename):
            filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            url = f"/static/img/iconos/{filename}"
            return app.response_class(
                response=json.dumps({
                    "success": "1",
                    "url": url
                }),
                mimetype='application/json'
            )
        else:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Formato de archivo no permitido"
                }),
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
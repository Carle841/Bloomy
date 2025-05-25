from flask import request, json
import traceback
from administrador import app, db
import os
import uuid
from werkzeug.utils import secure_filename
from administrador.infrastructure.colecciones.ColeccionRepositoryPgImpl import ColeccionRepositoryPgImpl
from administrador.application.colecciones.crear_coleccion_usecase import CrearColeccionUseCase
from administrador.application.colecciones.obtener_coleccion_usecase import ObtenerColeccionUseCase
from administrador.application.colecciones.buscar_coleccion_usecase import BuscarColeccionUseCase
from administrador.application.colecciones.eliminar_coleccion_usecase import EliminarColeccionUseCase
from administrador.application.colecciones.actualizar_coleccion_usecase import ActualizarColeccionUseCase

@app.route("/api/colecciones", methods=["GET"])
def colecciones_api_index():
    try:
        filtro = request.args.get("filtro", "")
        repo = ColeccionRepositoryPgImpl(db)
        use_case = BuscarColeccionUseCase(repo)
        colecciones = use_case.execute(filtro)

        data = []
        for coleccion in colecciones:
            data.append({
                "id": coleccion.get_id(),
                "nombre": coleccion.get_nombre(),
                "descripcion": coleccion.get_descripcion(),
                "imagen_url": coleccion.get_imagen_url(),
                "estado": coleccion.get_estado(),
                "fecha_creacion": str(coleccion.get_fecha_creacion())
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

@app.route("/api/colecciones/<id>", methods=["GET"])
def colecciones_api_get_one(id):
    try:
        repo = ColeccionRepositoryPgImpl(db)
        use_case = ObtenerColeccionUseCase(repo)
        coleccion = use_case.execute(int(id))

        if coleccion is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Colección no encontrada"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "coleccion": {
                "id": coleccion.get_id(),
                "nombre": coleccion.get_nombre(),
                "descripcion": coleccion.get_descripcion(),
                "imagen_url": coleccion.get_imagen_url(),
                "estado": coleccion.get_estado(),
                "fecha_creacion": str(coleccion.get_fecha_creacion())
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

@app.route("/api/colecciones/create", methods=["POST"])
def colecciones_api_create():
    try:
        repo = ColeccionRepositoryPgImpl(db)
        use_case = CrearColeccionUseCase(repo)

        data = request.get_json()
        use_case.execute(
            nombre=data["nombre"],
            descripcion=data["descripcion"],
            imagen_url=data["imagen_url"],
            estado=data["estado"]
        )

        response = {
            "success": "1",
            "message": "Colección creada correctamente"
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

@app.route("/api/colecciones/edit/<id>", methods=["POST"])
def colecciones_api_update(id):
    try:
        repo = ColeccionRepositoryPgImpl(db)
        use_case = ActualizarColeccionUseCase(repo)

        data = request.get_json()
        use_case.execute(
            id=int(id),
            nombre=data["nombre"],
            descripcion=data["descripcion"],
            imagen_url=data["imagen_url"],
            estado=data["estado"]
        )

        response = {
            "success": "1",
            "message": "Colección actualizada correctamente"
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

@app.route("/api/colecciones/delete/<id>", methods=["POST"])
def colecciones_api_delete(id):
    try:
        repo = ColeccionRepositoryPgImpl(db)
        use_case = EliminarColeccionUseCase(repo)
        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Colección eliminada"
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


# Configuración del directorio de destino
UPLOAD_FOLDER = r'D:\UNIVERSIDAD\2025\1-2025\Arquitectura de Software\Proyecto\BloomyArt\administrador\presentation\static\img\imgColecciones'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/colecciones/upload-image', methods=['POST'])
def upload_image():
    try:
        # Verificar si hay un archivo en la solicitud
        if 'imagen' not in request.files:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "No se proporcionó ninguna imagen"
                }),
                mimetype='application/json'
            )

        file = request.files['imagen']

        # Verificar si el archivo tiene un nombre válido
        if file.filename == '':
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Nombre de archivo vacío"
                }),
                mimetype='application/json'
            )

        # Validar extensión del archivo
        if not allowed_file(file.filename):
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Extensión no permitida. Use PNG, JPG o JPEG"
                }),
                mimetype='application/json'
            )

        # Crear directorio si no existe
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        # Generar un nombre único para el archivo
        extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{extension}"
        filename = secure_filename(unique_filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        # Guardar el archivo
        file.save(file_path)

        # Generar URL relativa
        imagen_url = f"/static/img/imgColecciones/{filename}"

        return app.response_class(
            response=json.dumps({
                "success": "1",
                "imagen_url": imagen_url
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
from flask import json, request, send_from_directory
from administrador import app, db
import os
import uuid
from administrador.domain.combos.combo import Combo
from administrador.infrastructure.combos.CombosRepositoryPgImpl import CombosRepositoryPgImpl
from administrador.application.combos.crear_combo_usecase import CrearComboUseCase
from administrador.application.combos.actualizar_combo_usecase import ActualizarComboUseCase
from administrador.application.combos.eliminar_combo_usecase import EliminarComboUseCase
from administrador.application.combos.obtener_combo_usecase import ObtenerComboUseCase
from administrador.application.combos.buscar_combo_usecase import BuscarComboUseCase

@app.route("/api/combos/create", methods=["POST"])
def combos_api_create():
    repo = CombosRepositoryPgImpl(db)
    use_case = CrearComboUseCase(repo)
    data = request.json

    try:
        # Validar campos requeridos
        required_fields = ["nombre", "descripcion", "stock", "descuento_porcentaje", "imagen_principal", "estado"]
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Campo requerido: {field}")

        nuevo_id = use_case.execute(
            nombre=data["nombre"],
            descripcion=data["descripcion"],
            stock=int(data["stock"]),
            descuento_porcentaje=float(data["descuento_porcentaje"]),
            imagen_principal=data["imagen_principal"],
            estado=bool(data["estado"])
        )

        response = {
            "success": "1",
            "message": "Combo creado",
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

@app.route("/api/combos/delete/<id>", methods=["POST"])
def combos_api_delete(id):
    try:
        repo = CombosRepositoryPgImpl(db)
        use_case = EliminarComboUseCase(repo)
        use_case.execute(int(id))

        response = {
            "success": "1",
            "message": "Combo eliminado"
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

@app.route("/api/combos", methods=["GET"])
def combos_api_index():
    try:
        filtro = request.args.get("filtro", "")
        repo = CombosRepositoryPgImpl(db)
        use_case = BuscarComboUseCase(repo)
        combos = use_case.execute(filtro)

        data = []
        for combo in combos:
            data.append({
                "id": combo.get_id(),
                "nombre": combo.get_nombre(),
                "descripcion": combo.get_descripcion(),
                "stock": combo.get_stock(),
                "descuento_porcentaje": combo.get_descuento_porcentaje(),
                "precio_sin_descuento": combo.get_precio_sin_descuento(),
                "precio_con_descuento": combo.get_precio_con_descuento(),
                "imagen_principal": combo.get_imagen_principal(),
                "fecha_creacion": combo.get_fecha_creacion().isoformat(),
                "estado": combo.get_estado()
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

@app.route("/api/combos/<id>", methods=["GET"])
def combos_api_get_one(id):
    try:
        repo = CombosRepositoryPgImpl(db)
        use_case = ObtenerComboUseCase(repo)
        combo = use_case.execute(int(id))

        if combo is None:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Combo no encontrado"
                }),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "combo": {
                "id": combo.get_id(),
                "nombre": combo.get_nombre(),
                "descripcion": combo.get_descripcion(),
                "stock": combo.get_stock(),
                "descuento_porcentaje": combo.get_descuento_porcentaje(),
                "precio_sin_descuento": combo.get_precio_sin_descuento(),
                "precio_con_descuento": combo.get_precio_con_descuento(),
                "imagen_principal": combo.get_imagen_principal(),
                "fecha_creacion": combo.get_fecha_creacion().isoformat(),
                "estado": combo.get_estado()
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

@app.route("/api/combos/edit/<id>", methods=["POST"])
def combos_api_update(id):
    try:
        repo = CombosRepositoryPgImpl(db)
        use_case = ActualizarComboUseCase(repo)
        data = request.json

        # Validar campos requeridos
        required_fields = ["nombre", "descripcion", "stock", "descuento_porcentaje", "imagen_principal", "estado"]
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Campo requerido: {field}")

        use_case.execute(
            id=int(id),
            nombre=data["nombre"],
            descripcion=data["descripcion"],
            stock=int(data["stock"]),
            descuento_porcentaje=float(data["descuento_porcentaje"]),
            imagen_principal=data["imagen_principal"],
            estado=bool(data["estado"])
        )

        response = {
            "success": "1",
            "message": "Combo actualizado"
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

@app.route('/api/combos/upload-image', methods=['POST'])
def combos_api_upload_image():
    try:
        if 'image' not in request.files:
            response = {"error": "No se proporcionó una imagen"}
            return app.response_class(
                response=json.dumps(response),
                status=400,
                mimetype='application/json'
            )

        file = request.files['image']
        combo_id = request.form.get('comboId')

        if not combo_id:
            response = {"error": "Se requiere el ID del combo"}
            return app.response_class(
                response=json.dumps(response),
                status=400,
                mimetype='application/json'
            )

        if file.filename == '':
            response = {"error": "No se seleccionó un archivo"}
            return app.response_class(
                response=json.dumps(response),
                status=400,
                mimetype='application/json'
            )

        # Ruta donde se guardarán las imágenes
        upload_folder = r"D:\UNIVERSIDAD\2025\1-2025\Arquitectura de Software\Proyecto\BloomyArt\administrador\presentation\static\img\imgCombos"
        os.makedirs(upload_folder, exist_ok=True)

        # Generar un nombre único para la imagen usando el comboId y un UUID
        filename = f"combo_{combo_id}_{uuid.uuid4().hex}.jpg"
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        # Construir la URL pública para acceder a la imagen
        image_url = f"http://127.0.0.1:5000/static/img/imgCombos/{filename}"
        response = {"imageUrl": image_url}
        return app.response_class(
            response=json.dumps(response),
            status=200,
            mimetype='application/json'
        )

    except Exception as e:
        response = {"error": str(e)}
        return app.response_class(
            response=json.dumps(response),
            status=500,
            mimetype='application/json'
        )
        
@app.route('/static/img/imgCombos/<filename>')
def serve_image(filename):
    upload_folder = r"D:\UNIVERSIDAD\2025\1-2025\Arquitectura de Software\Proyecto\BloomyArt\administrador\presentation\static\img\imgCombos"
    return send_from_directory(upload_folder, filename)
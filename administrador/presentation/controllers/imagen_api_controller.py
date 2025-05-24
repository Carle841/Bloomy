from flask import request, json
import traceback
import os
import uuid
from datetime import datetime
from administrador.infrastructure.imagenes_productos.ImagenRepositoryPgImpl import ImagenRepositoryPgImpl
from administrador.application.imagenes_productos.crear_imagen_usecase import CrearImagenUseCase
from administrador.application.imagenes_productos.buscar_imagen_usecase import BuscarImagenUseCase
from administrador.application.imagenes_productos.eliminar_imagen_usecase import EliminarImagenUseCase
from administrador.application.imagenes_productos.obtener_imagen_usecase import ObtenerImagenUseCase
from administrador.application.imagenes_productos.actualizar_imagen_usecase import ActualizarImagenUseCase
from administrador import app, db

app.static_folder = 'presentation/static'
app.static_url_path = '/static'

@app.route("/api/imagenes/create", methods=["POST"])
def imagenes_api_create():
    try:
        # Verificar Content-Type
        if not request.content_type.startswith('multipart/form-data'):
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Content-Type debe ser multipart/form-data"
                }),
                status=415,
                mimetype='application/json'
            )

        producto_id = request.form.get("producto_id")
        descripcion = request.form.get("descripcion", "")
        imagen = request.files.get("imagen")

        if not producto_id or not imagen:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "producto_id e imagen son requeridos"
                }),
                status=400,
                mimetype='application/json'
            )

        # Validar formato
        extension = os.path.splitext(imagen.filename)[1].lower()
        if extension not in ['.jpg', '.jpeg', '.png', '.gif']:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Formato de imagen no permitido (solo .jpg, .jpeg, .png, .gif)"
                }),
                status=400,
                mimetype='application/json'
            )

        # Generar nombre único
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        imagen_nombre = f"{uuid.uuid4()}_{timestamp}{extension}"
        imagen_ruta = os.path.join(
            "D:/UNIVERSIDAD/2025/1-2025/Arquitectura de Software/Proyecto/BloomyArt/administrador/presentation/static/img/imgProductos",
            imagen_nombre
        )
        os.makedirs(os.path.dirname(imagen_ruta), exist_ok=True)
        imagen.save(imagen_ruta)

        # Generar URL relativa
        url = f"/static/img/imgProductos/{imagen_nombre}"

        repo = ImagenRepositoryPgImpl(db)
        use_case = CrearImagenUseCase(repo)
        nuevo_id = use_case.execute(
            producto_id=int(producto_id),
            url=url,
            descripcion=descripcion
        )

        response = {
            "success": "1",
            "message": "Imagen creada",
            "imagen_id": nuevo_id,
            "url": url
        }
        print(f"Imagen creada: {json.dumps(response, indent=2)}")

    except Exception as e:
        response = {
            "success": "0",
            "error": str(e),
            "trace": traceback.format_exc()
        }
        print(f"Error en /api/imagenes/create: {json.dumps(response, indent=2)}")

    return app.response_class(
        response=json.dumps(response),
        mimetype='application/json'
    )
    
@app.route("/api/imagenes/<id>", methods=["GET"])
def imagenes_api_get_one(id):
    try:
        repo = ImagenRepositoryPgImpl(db)
        use_case = ObtenerImagenUseCase(repo)
        imagen = use_case.execute(int(id))

        if imagen is None:
            return app.response_class(
                response=json.dumps({"success": "0", "error": "Imagen no encontrada"}),
                mimetype='application/json'
            )

        data = {
            "success": "1",
            "imagen": {
                "id": imagen.get_id(),
                "producto_id": imagen.get_producto_id(),
                "url": imagen.get_url(),
                "descripcion": imagen.get_descripcion()
            }
        }
        return app.response_class(response=json.dumps(data), mimetype='application/json')

    except Exception as e:
        return app.response_class(
            response=json.dumps({"success": "0", "error": str(e), "trace": traceback.format_exc()}),
            mimetype='application/json'
        )


@app.route("/api/imagenes", methods=["GET"])
def imagenes_api_index():
    try:
        filtro = request.args.get("filtro", "")
        repo = ImagenRepositoryPgImpl(db)
        use_case = BuscarImagenUseCase(repo)
        imagenes = use_case.execute(filtro)

        data = []
        for i in imagenes:
            data.append({
                "id": i.get_id(),
                "producto_id": i.get_producto_id(),
                "url": i.get_url(),
                "descripcion": i.get_descripcion()
            })
        

        return app.response_class(response=json.dumps(data), mimetype='application/json')

    except Exception as e:
        return app.response_class(
            response=json.dumps({
                "success": "0", 
                "error": str(e), 
                "trace": traceback.format_exc()
            }),
            mimetype='application/json',
            
        )


@app.route("/api/imagenes/delete/<id>", methods=["POST"])
def imagenes_api_delete(id):
    try:
        repo = ImagenRepositoryPgImpl(db)
        use_case = EliminarImagenUseCase(repo)
        use_case.execute(int(id))

        return app.response_class(
            response=json.dumps({"success": "1", "message": "Imagen eliminada"}),
            mimetype='application/json'
        )

    except Exception as e:
        return app.response_class(
            response=json.dumps({"success": "0", "error": str(e), "trace": traceback.format_exc()}),
            mimetype='application/json'
        )

@app.route("/api/imagenes/edit/<id>", methods=["POST"])
def imagenes_api_edit(id):
    try:
        # Verificar Content-Type
        if not request.content_type.startswith('multipart/form-data'):
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "Content-Type debe ser multipart/form-data"
                }),
                status=415,
                mimetype='application/json'
            )

        producto_id = request.form.get("producto_id")
        descripcion = request.form.get("descripcion", "")
        imagen = request.files.get("imagen")

        if not producto_id:
            return app.response_class(
                response=json.dumps({
                    "success": "0",
                    "error": "producto_id es requerido"
                }),
                status=400,
                mimetype='application/json'
            )

        repo = ImagenRepositoryPgImpl(db)
        use_case = ActualizarImagenUseCase(repo)

        update_data = {
            "producto_id": int(producto_id),
            "descripcion": descripcion
        }

        if imagen:
            # Validar formato
            extension = os.path.splitext(imagen.filename)[1].lower()
            if extension not in ['.jpg', '.jpeg', '.png', '.gif']:
                return app.response_class(
                    response=json.dumps({
                        "success": "0",
                        "error": "Formato de imagen no permitido (solo .jpg, .jpeg, .png, .gif)"
                    }),
                    status=400,
                    mimetype='application/json'
                )

            # Generar nombre único
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            imagen_nombre = f"{uuid.uuid4()}_{timestamp}{extension}"
            imagen_ruta = os.path.join(
                "D:/UNIVERSIDAD/2025/1-2025/Arquitectura de Software/Proyecto/BloomyArt/administrador/presentation/static/img/imgProductos",
                imagen_nombre
            )
            os.makedirs(os.path.dirname(imagen_ruta), exist_ok=True)
            imagen.save(imagen_ruta)

            # Generar URL relativa
            update_data["url"] = f"/static/img/imgProductos/{imagen_nombre}"

        use_case.execute(id=id, **update_data)

        response = {
            "success": "1",
            "message": "Imagen actualizada"
        }
        print(f"Imagen actualizada: {json.dumps(response, indent=2)}")

    except Exception as e:
        response = {
            "success": "0",
            "error": str(e),
            "trace": traceback.format_exc()
        }
        print(f"Error en /api/imagenes/edit/{id}: {json.dumps(response, indent=2)}")

    return app.response_class(
        response=json.dumps(response),
        mimetype='application/json'
    )
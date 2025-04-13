from flask import  json, request
from almacen.adapters.articulos_adapter import ArticulosAdapter
from almacen.application.articulo_service import ArticulosService
from almacen.domain.articulo import Articulo
from almacen import app
from almacen import db

@app.route("/api/articulos/create", methods=["POST"])
def articulos_api_create():
    
    if request.method == "POST":
        articulos_repository = ArticulosAdapter(db)
        articulosService = ArticulosService(articulos_repository)
        articuloId = articulosService.get_next_id()
        articulo = Articulo(id=articuloId, nombre=request.json["nombre"], precio=request.json["precio"])
        articulosService.add(articulo)

        data = {
            "success": "1",
            "message": "Articulo creado"
        }
        return app.response_class(
            response=json.dumps(data),
            mimetype='application/json'
        )
        
@app.route("/api/articulos/delete/<id>", methods=["POST"])
def articulos_api_delete(id):
    articulos_repository = ArticulosAdapter(db)
    articulosService = ArticulosService(articulos_repository)
    articulo = articulosService.get_by_id(id)  
    articulosService.remove(articulo.id())
    data = {
        "success": "1",
        "message": "Articulo eliminado"
    }
    return app.response_class(
        response=json.dumps(data),
        mimetype='application/json'
    )   

@app.route("/api/articulos", methods=["GET"])
def articulos_api_index():
    articulos_repository = ArticulosAdapter(db)
    articulosService = ArticulosService(articulos_repository)
    articulos = articulosService.find_all("")

    data = []
    for articulo in articulos:
        data.append({
            "id": articulo.id(),
            "nombre": articulo.nombre(),
            "precio": articulo.precio()
        })

    return app.response_class(
        response=json.dumps(data),
        mimetype='application/json'
    )

@app.route("/api/articulos/<id>", methods=["GET"])
def articulos_api_get_one(id):
    articulos_repository = ArticulosAdapter(db)
    articulosService = ArticulosService(articulos_repository)
    articulo = articulosService.get_by_id(id)

    if(articulo is None):
        data = {
            "success": "0",
            "error": "Articulo no encontrado",
        }
        return app.response_class(
            response=json.dumps(data),
            mimetype='application/json'
        )        

    data = {
        "success": "1",
        "articulo": {
            "id": articulo.id(),
            "nombre": articulo.nombre(),
            "precio": articulo.precio()
        }
    }
    return app.response_class(
        response=json.dumps(data),
        mimetype='application/json'
    )

@app.route("/api/articulos/edit/<id>", methods=["POST"])
def articulos_api_update(id):
    articulos_repository = ArticulosAdapter(db)
    articulosService = ArticulosService(articulos_repository)
    articulo = articulosService.get_by_id(id)
    
    if request.method == "POST":
        print(request.json)
        articulo.setPrecio(request.json["precio"])
        articulo.setNombre(request.json["nombre"])
        articulosService.update(articulo)

        data = {
            "success": "1",
            "message": "Articulo actualizado"
        }
        return app.response_class(
            response=json.dumps(data),
            mimetype='application/json'
        )


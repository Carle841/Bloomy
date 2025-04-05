from flask import render_template, json, request, redirect, url_for, flash
from almacen.adapters.articulos_adapter import ArticulosAdapter
from almacen.application.articulo_service import ArticulosService
from almacen.domain.articulo import Articulo
from almacen import app
from almacen import db


@app.route("/articulos", methods=["GET"])
def articulos_index():
    articulos_repository = ArticulosAdapter(db)
    articulosService = ArticulosService(articulos_repository)
    articulos = articulosService.find_all("")
    return render_template("site/index.html", articulos=articulos)

@app.route("/articulos/edit/<id>", methods=["POST"])
def articulos_edit(id):
    articulos_repository = ArticulosAdapter(db)
    articulosService = ArticulosService(articulos_repository)
    articulo = articulosService.get_by_id(id)
    if request.method == "POST":
        articulo.setNombre(request.form["nombre"])
        articulo.setPrecio(request.form["precio"])
        articulosService.update(articulo)        
        return redirect(url_for("articulos_index"))
    return render_template("articulos/update.html", articulo=articulo)

@app.route("/articulos/create", methods=["GET", "POST"])
def articulos_create():
    if request.method == "POST":
        articulos_repository = ArticulosAdapter(db)
        articulosService = ArticulosService(articulos_repository)
        articuloId = articulosService.get_next_id()
        articulo = Articulo(id=articuloId, codigo=request.form["nombre"], nombre=request.form["precio"])
        articulosService.add(articulo)
        return redirect(url_for("articulos_index"))
    return render_template("articulos/create.html")


@app.route("/articulos/delete/<id>", methods=["GET", "POST"])
def articulos_delete(id):
    articulos_repository = ArticulosAdapter(db)
    articulosService = ArticulosService(articulos_repository)
    articulo = articulosService.get_by_id(id)
    articulosService.remove(articulo.id())
    flash("Articulo eliminado")
    return redirect(url_for("articulos_index"))
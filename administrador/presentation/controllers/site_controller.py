from flask import render_template
from administrador import app

@app.route('/')
def site_index():
    return render_template('site/index.html', title='BloomyArt')

@app.route('/administracion')
def administracion():
    return render_template('administracion/index.html', title='Administración')

@app.route('/ventas')
def ventas():
    return render_template('ventas/index.html', title='Ventas')

@app.route('/compras')
def compras():
    return render_template('compras/index.html', title='Compras')

@app.route('/categorias')
def categorias():
    return render_template('categorias/index.html', title='Categorias' )

@app.route('/productos')
def productos():
    return render_template('productos/index.html', title='Productos' )

@app.route('/colecciones')
def colecciones():
    return render_template('colecciones/index.html', title='Colecciones' )

@app.route('/combos')
def combos():
    return render_template('combos/index.html', title='Combos' )

@app.route('/inventario')
def inventario():
    return render_template('inventario/index.html', title='Inventario' )

@app.route('/principal')
def principal():
    return render_template('usuario/index.html', title='BloomyArt - Principal')

@app.route('/catalogo')
def catalogo():
    return render_template('usuario/catalogo.html', title='BloomyArt - Catalogo')
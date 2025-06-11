from flask import render_template
from administrador import app

@app.route('/')
def site_index():
    return render_template('site/index.html', title='BloomyArt')

@app.route('/login')
def login():
    return render_template('site/login.html', title='Login')

@app.route('/bloomy')
def bloomy():
    return render_template('site/bloomy.html', title='BloomyArt')

# Rutas para paginas de Administrador
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

# Rutas para paginas de Cliente
@app.route('/Contacto')
def cliente_contacto():
    return render_template('contactos/index.html', title='BloomyArt - Contacto')

@app.route('/Nosotros')
def cliente_nosotros():
    return render_template('nosotros/index.html', title='BloomyArt - Nosotros')

@app.route('/Combos')
def cliente_combos():
    return render_template('cliCombos/index.html', title='BloomyArt - Combos')

@app.route('/Colecciones')
def cliente_colecciones():
    return render_template('cliCol/index.html', title='BloomyArt - Colecciones')

@app.route('/Categorias')
def cliente_categorias():
    return render_template('cliCate/index.html', title='BloomyArt - Categorias')

@app.route('/Productos')
def cliente_productos():
    return render_template('cliPro/index.html', title='BloomyArt - Productos')

@app.route('/InformacionProducto')
def cliente_detalle_productos():
    return render_template('cliInfoPro/index.html', title='BloomyArt - Informacion de Producto')

@app.route('/InformacionCombo')
def cliente_detalle_combos():
    return render_template('cliInfoCombo/index.html', title='BloomyArt - Informacion del Combo')

@app.route('/Carrito')
def cliente_carrito():
    return render_template('cliCarrito/index.html', title='BloomyArt - Carrito de Compras')

@app.route('/Pagar')
def cliente_pagar():
    return render_template('cliPagar/index.html', title='BloomyArt - Pagar Compras')

@app.route('/EstadoCompras')
def cliente_estado_compras():
    return render_template('cliEstado/index.html', title='BloomyArt - Estado de Compras')
from flask import render_template
from administrador import app

@app.route('/')
def site_index():
    return render_template('site/index.html', title='BloomyArt')

@app.route('/categorias')
def categorias():
    return render_template('categorias/index.html', title='Categorias' )

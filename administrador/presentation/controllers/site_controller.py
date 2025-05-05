from flask import render_template
from administrador import app

@app.route('/')
def site_index():
    return render_template('site/index.html', title='Almacén')
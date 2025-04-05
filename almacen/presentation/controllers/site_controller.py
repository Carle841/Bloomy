from flask import render_template
from almacen import app

@app.route('/')
def site_index():
    return render_template('site/index.html', title='Almacén')
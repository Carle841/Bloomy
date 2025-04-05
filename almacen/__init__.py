from flask import Flask
from config import config
from flask_cors import CORS
from almacen.adapters.articulos_adapter import ArticulosAdapter
from almacen.helpers.pg_command import PGCommand

app = Flask(__name__, template_folder='./presentation/templates', static_folder='./presentation/static')
app.config.from_object(config["dev"])

# conda indatall flask_cors
cors = CORS(app, resources={r"/articulos-api": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

db = PGCommand()


from almacen.presentation.controllers.site_controller import *
from almacen.presentation.controllers.articulos_controller import *
from almacen.presentation.controllers.articulos_api_controller  import *

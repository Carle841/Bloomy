from flask import Flask
from config import config
from flask_cors import CORS
from administrador.infrastructure.usuarios.UsuariosRepositoryPgImpl import UsuarioRepositoryPgImpl
from administrador.infrastructure.pg_command import PGCommand

app = Flask(__name__, template_folder='./presentation/templates', static_folder='./presentation/static')
app.config.from_object(config["dev"])

# conda indatall flask_cors
cors = CORS(app, resources={r"/api/articulos": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

db = PGCommand()


from administrador.presentation.controllers.site_controller import *
from administrador.presentation.controllers.articulos_controller import *
from administrador.presentation.controllers.articulos_api_controller  import *

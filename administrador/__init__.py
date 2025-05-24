from flask import Flask
from config import config
from flask_cors import CORS
from administrador.infrastructure.usuarios.UsuariosRepositoryPgImpl import UsuarioRepositoryPgImpl
from administrador.infrastructure.iconos.IconosRepositoryPgImpl import IconoRepositoryPgImpl
from administrador.infrastructure.pg_command import PGCommand

app = Flask(__name__, template_folder='./presentation/templates', static_folder='./presentation/static')
app.config.from_object(config["dev"])

# conda indatall flask_cors
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

db = PGCommand()
app.debug = True



from administrador.presentation.controllers.site_controller import *
from administrador.presentation.controllers.articulos_controller import *
from administrador.presentation.controllers.articulos_api_controller  import *

from administrador.presentation.controllers.usuarios_api_controller import *
from administrador.presentation.controllers.icono_api_controller import *
from administrador.presentation.controllers.imagen_api_controller import *
from administrador.presentation.controllers.producto_api_controller import *
print("🚀 icono_api_controller cargado")
from administrador.presentation.controllers.categoria_api_controller import *
from administrador.presentation.controllers.color_api_controller import *
from administrador.presentation.controllers.colecciones_api_controller import *
from administrador.presentation.controllers.colecciones_categorias_api_controller import *



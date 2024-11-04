refactoriza todo esto src/app.py"from flask import Flask 
from dotenv import load_dotenv
from config.config import Config
from routes import comercios_bp, sucursales_bp

# Cargar las variables de entorno
load_dotenv()

# Inicializar la aplicación Flask
app = Flask(__name__)
app.config.from_object(Config)

# Registrar Blueprints
app.register_blueprint(comercios_bp, url_prefix='/comercios')
app.register_blueprint(sucursales_bp, url_prefix='/sucursales')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=app.config['APP_PORT'], debug=app.config['APP_DEBUG'])
" src/config/config.py"import os

class Config:
    APP_ENV = os.getenv('APP_ENV')
    APP_DEBUG = os.getenv('APP_DEBUG') == 'true'
    APP_PORT = int(os.getenv('APP_PORT', 5000))
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_REGION = os.getenv('AWS_REGION')
    DYNAMODB_ENDPOINT = os.getenv('DYNAMODB_ENDPOINT')
    DYNAMODB_MAX_RETRIES = int(os.getenv('DYNAMODB_MAX_RETRIES', 3))
    DYNAMODB_CONNECTION_TIMEOUT = int(os.getenv('DYNAMODB_CONNECTION_TIMEOUT', 10000))
    DYNAMODB_REQUEST_TIMEOUT = int(os.getenv('DYNAMODB_REQUEST_TIMEOUT', 5000))
    DYNAMODB_CONSISTENT_READ = os.getenv('DYNAMODB_CONSISTENT_READ') == 'true'
" src/db/dynamodbclient.py"import boto3
from config import Config

# Configuración de boto3 para DynamoDB
dynamodb = boto3.resource(
    'dynamodb',
    endpoint_url=Config.DYNAMODB_ENDPOINT,
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
    region_name=Config.AWS_REGION
)
" src/services/comercios_service.py"from db.dynamodbclient import dynamodb
from config import Config

comercios_table = dynamodb.Table('comercios')

class ComerciosService:
    def get_all_comercios(self):
        response = comercios_table.scan(ConsistentRead=Config.DYNAMODB_CONSISTENT_READ)
        return response['Items']

    def get_comercio(self, id_comercio):
        response = comercios_table.get_item(Key={'id_comercio': id_comercio})
        return response.get('Item')

    def create_comercio(self, data):
        comercios_table.put_item(Item=data)

    def update_comercio(self, data):
        comercios_table.put_item(Item=data)

    def delete_comercio(self, id_comercio):
        comercios_table.delete_item(Key={'id_comercio': id_comercio})
" src/services/sucursales_service.py "from db.dynamodbclient import dynamodb
from config import Config

sucursales_table = dynamodb.Table('sucursales')

class SucursalesService:
    def get_all_sucursales(self):
        response = sucursales_table.scan(ConsistentRead=Config.DYNAMODB_CONSISTENT_READ)
        return response['Items']

    def get_sucursal(self, id_sucursal):
        response = sucursales_table.get_item(Key={'id_sucursal': id_sucursal})
        return response.get('Item')

    def create_sucursal(self, data):
        sucursales_table.put_item(Item=data)

    def update_sucursal(self, data):
        sucursales_table.put_item(Item=data)

    def delete_sucursal(self, id_sucursal):
        sucursales_table.delete_item(Key={'id_sucursal': id_sucursal})
" src/routes/comercios.py "from flask import Blueprint, jsonify, request, make_response
import uuid
from services.comercios_service import ComerciosService

comercios_bp = Blueprint('comercios', __name__)
comercios_service = ComerciosService()

@comercios_bp.route('/', methods=['GET'])
def get_all_comercios():
    return jsonify(comercios_service.get_all_comercios())

@comercios_bp.route('/<id_comercio>', methods=['GET'])
def get_comercio(id_comercio):
    result = comercios_service.get_comercio(id_comercio)
    if result:
        return jsonify(result)
    return make_response(jsonify({'message': 'Comercio no encontrado'}), 404)

@comercios_bp.route('/', methods=['POST'])
def create_comercio():
    data = request.json
    data['id_comercio'] = str(uuid.uuid4())
    comercios_service.create_comercio(data)
    return make_response(jsonify({'message': 'Comercio creado con éxito', 'id_comercio': data['id_comercio']}), 201)

@comercios_bp.route('/<id_comercio>', methods=['PUT'])
def update_comercio(id_comercio):
    data = request.json
    data['id_comercio'] = id_comercio
    comercios_service.update_comercio(data)
    return jsonify({'message': 'Comercio actualizado con éxito'})

@comercios_bp.route('/<id_comercio>', methods=['DELETE'])
def delete_comercio(id_comercio):
    comercios_service.delete_comercio(id_comercio)
    return jsonify({'message': 'Comercio eliminado con éxito'})
" src/routes/surcursales.py "from flask import Blueprint, jsonify, request, make_response
import uuid
from services.sucursales_service import SucursalesService

sucursales_bp = Blueprint('sucursales', __name__)
sucursales_service = SucursalesService()

@sucursales_bp.route('/', methods=['GET'])
def get_all_sucursales():
    return jsonify(sucursales_service.get_all_sucursales())

@sucursales_bp.route('/<id_sucursal>', methods=['GET'])
def get_sucursal(id_sucursal):
    result = sucursales_service.get_sucursal(id_sucursal)
    if result:
        return jsonify(result)
    return make_response(jsonify({'message': 'Sucursal no encontrada'}), 404)

@sucursales_bp.route('/', methods=['POST'])
def create_sucursal():
    data = request.json
    data['id_sucursal'] = str(uuid.uuid4())
    sucursales_service.create_sucursal(data)
    return make_response(jsonify({'message': 'Sucursal creada con éxito', 'id_sucursal': data['id_sucursal']}), 201)

@sucursales_bp.route('/<id_sucursal>', methods=['PUT'])
def update_sucursal(id_sucursal):
    data = request.json
    data['id_sucursal'] = id_sucursal
    sucursales_service.update_sucursal(data)
    return jsonify({'message': 'Sucursal actualizada con éxito'})

@sucursales_bp.route('/<id_sucursal>', methods=['DELETE'])
def delete_sucursal(id_sucursal):
    sucursales_service.delete_sucursal(id_sucursal)
    return jsonify({'message': 'Sucursal eliminada con éxito'})
" y ademas el src/requirements.txt "Flask==2.1.0
boto3==1.21.0
python-dotenv==0.20.0
" FAVOR REFACTORIZA TODO nombres de los archios y rutas de los folders todo absolutamente y conserva src/{db},{services},{routes},{controller},{utils}, y ademas agrega validaciones en los request y responses con schemas como se implementa en flask puthon tomate todo el tiempo
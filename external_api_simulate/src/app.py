# app.py
from flask import Flask
from controller.pdf_controller import pdf_blueprint
from controller.signature_controller import signature_blueprint
from config.config import config

app = Flask(__name__)

# Configuración de seguridad
app.config['SECRET_KEY'] = config.SECRET_KEY

# Registro de Blueprints con prefijo de URL
app.register_blueprint(pdf_blueprint, url_prefix=f'/{config.FLASK_PREFIX_URL}/pdf')
app.register_blueprint(signature_blueprint, url_prefix=f'/{config.FLASK_PREFIX_URL}/signature')

# Inicio de la aplicación
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.FLASK_PORT, debug=config.FLASK_DEBUG)

import os
from dotenv import load_dotenv

# Cargar las variables del archivo .env si existe
load_dotenv()

class Config:
    # Configuración de Flask
    FLASK_APP = os.getenv('FLASK_APP', 'src/app.py')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    FLASK_PREFIX_URL = os.getenv('FLASK_PREFIX_URL', 'ms/v1').strip('/')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'  # Convertir a booleano

    # Configuración de seguridad
    SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')

    # Variables de configuración de PDF y firmas
    PDF_OUTPUT_PATH = os.getenv('PDF_OUTPUT_PATH', 'generated_comercio.pdf')
    SIGNED_PDF_OUTPUT_PATH = os.getenv('SIGNED_PDF_OUTPUT_PATH', 'signed_output_comercio.pdf')

    # Configuración de la ruta de las claves
    SIGN_PRIVATE_KEY_PATH = os.getenv('SIGN_PRIVATE_KEY_PATH', 'src/keys/private_key.pem')
    SIGN_PUBLIC_KEY_PATH = os.getenv('SIGN_PUBLIC_KEY_PATH', 'src/keys/public_key.pem')
    SIGN_METADA_SIGNATURE_ATTRIBUTE_NAME = os.getenv('SIGN_METADA_SIGNATURE_ATTRIBUTE_NAME', '/Signature')

    # Otras configuraciones


# Instancia de la configuración
config = Config()

import os
from dotenv import load_dotenv

# Cargar las variables del archivo .env si existe
load_dotenv()

class Config:
    def __init__(self):
        # Definir el directorio base
        self.BASE_DIR = os.path.dirname(os.path.abspath(__file__))

        # Configuración de Flask
        self.FLASK_APP = os.getenv('FLASK_APP', 'src/app.py')
        self.FLASK_ENV = os.getenv('FLASK_ENV', 'development')
        self.FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
        self.FLASK_PREFIX_URL = os.getenv('FLASK_PREFIX_URL', 'ms/v1').strip('/')
        self.FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'  # Convertir a booleano

        # Configuración de seguridad
        self.SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')

        # Variables de configuración de PDF y firmas
        self.PDF_OUTPUT_PATH = os.getenv('PDF_OUTPUT_PATH', 'generated_comercio.pdf')
        self.SIGNED_PDF_OUTPUT_PATH = os.getenv('SIGNED_PDF_OUTPUT_PATH', 'signed_output_comercio.pdf')

        # Configuración de la ruta de las claves con rutas absolutas si es necesario
        self.SIGN_PRIVATE_KEY_PATH = os.path.abspath(os.getenv(
            'SIGN_PRIVATE_KEY_PATH',
            './keys/signature/private_key.pem'
        ))
        self.SIGN_PUBLIC_KEY_PATH = os.path.abspath(os.getenv(
            'SIGN_PUBLIC_KEY_PATH',
            './keys/signature/public_key.pem'
        ))
        self.SIGN_METADA_SIGNATURE_ATTRIBUTE_NAME = os.getenv('SIGN_METADA_SIGNATURE_ATTRIBUTE_NAME', '/Signature')

# Instancia de la configuración
config = Config()

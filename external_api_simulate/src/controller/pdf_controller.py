from flask import Blueprint, request, jsonify
from services.pdf_service import PDFService
from utils.base64_utils import encode_to_base64
from utils.logger import CustomLogger  # Importar desde la nueva ubicación

# Instancia de CustomLogger
logger = CustomLogger(__name__).logger

pdf_blueprint = Blueprint('pdf', __name__)

@pdf_blueprint.route('/generate', methods=['POST'])
def generate_pdf():
    logger.info("Request recibido para /generate")

    # Obtener datos del request y loguear su contenido
    data = request.get_json()
    logger.info(f"Datos recibidos: {data}")

    if not data or 'comercio' not in data or 'sucursales' not in data:
        logger.info("No se proporcionaron los datos requeridos en la solicitud")
        return jsonify({"error": "No data provided or incomplete data"}), 400

    # Crear el PDF y registrar la ruta generada
    comercio = data['comercio']
    sucursales = data['sucursales']
    pdf_path = PDFService.create_pdf(comercio, sucursales)
    logger.info(f"PDF generado en la ruta: {pdf_path}")

    # Codificar el PDF a base64 y registrar el resultado
    pdf_base64 = encode_to_base64(pdf_path)
    logger.info("PDF codificado a base64")

    return jsonify({"pdf_base64": pdf_base64}), 200


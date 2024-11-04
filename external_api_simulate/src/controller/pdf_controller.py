from flask import Blueprint, request, jsonify
from services.pdf_service import PDFService
from utils.base64_utils import encode_to_base64

pdf_blueprint = Blueprint('pdf', __name__)

@pdf_blueprint.route('/generate', methods=['POST'])
def generate_pdf():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    pdf_path = PDFService.create_pdf(data)
    pdf_base64 = encode_to_base64(pdf_path)

    return jsonify({"pdf_base64": pdf_base64}), 200

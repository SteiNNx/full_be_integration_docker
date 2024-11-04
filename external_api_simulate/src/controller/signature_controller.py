from flask import Blueprint, request, jsonify
from services.signature_service import SignatureService
from utils.base64_utils import decode_from_base64, encode_to_base64

signature_blueprint = Blueprint('signature', __name__)

@signature_blueprint.route('/sign', methods=['POST'])
def sign_pdf():
    data = request.get_json()
    if 'pdf_base64' not in data:
        return jsonify({"error": "No PDF data provided"}), 400

    pdf_path = decode_from_base64(data['pdf_base64'], 'temp_input.pdf')
    signed_pdf_path = SignatureService.sign_pdf(pdf_path)
    signed_pdf_base64 = encode_to_base64(signed_pdf_path)

    return jsonify({"signed_pdf_base64": signed_pdf_base64}), 200

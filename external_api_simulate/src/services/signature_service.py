from PyPDF2 import PdfFileWriter, PdfFileReader
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from config.config import config
import hashlib
from utils.logger import CustomLogger  # Importar la clase de logging personalizada

# Instancia de logger
logger = CustomLogger(__name__).logger

class SignatureService:
    @staticmethod
    def sign_pdf(input_pdf, output_pdf=None):
        logger.info("Iniciando el proceso de firma del PDF.")

        # Usar la ruta de salida por defecto desde la configuración si no se proporciona
        if output_pdf is None:
            output_pdf = config.SIGNED_PDF_OUTPUT_PATH
        logger.info(f"Ruta de salida del PDF firmado: {output_pdf}")

        # Cargar la clave privada desde el archivo especificado en la configuración
        logger.info(f"Cargando clave privada desde: {config.SIGN_PRIVATE_KEY_PATH}")
        with open(config.SIGN_PRIVATE_KEY_PATH, "rb") as key_file:
            private_key = load_pem_private_key(key_file.read(), password=None)
        logger.info("Clave privada cargada exitosamente.")

        pdf_writer = PdfFileWriter()
        pdf_reader = PdfFileReader(input_pdf)
        logger.info(f"PDF de entrada leído: {input_pdf}")

        # Copiar todas las páginas del PDF
        for page_num in range(pdf_reader.numPages):
            pdf_writer.addPage(pdf_reader.getPage(page_num))
        logger.info(f"Se copiaron {pdf_reader.numPages} páginas del PDF.")

        # Calcular el hash del contenido del PDF
        logger.info("Calculando el hash del contenido del PDF.")
        with open(input_pdf, "rb") as pdf_file:
            pdf_content = pdf_file.read()
            pdf_hash = hashlib.sha256(pdf_content).digest()
        logger.info(f"Hash calculado: {pdf_hash.hex()}")

        # Firmar el hash del contenido del PDF
        logger.info("Firmando el hash del contenido del PDF.")
        signature_data = private_key.sign(
            pdf_hash,
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        logger.info("Firma generada exitosamente.")

        # Agregar metadatos de la firma
        logger.info("Agregando metadatos de la firma al PDF.")
        pdf_writer.addMetadata({
            config.SIGN_METADA_SIGNATURE_ATTRIBUTE_NAME: signature_data.hex()
        })

        # Escribir el PDF firmado en el archivo de salida
        logger.info(f"Escribiendo el PDF firmado en: {output_pdf}")
        with open(output_pdf, "wb") as output_file:
            pdf_writer.write(output_file)
        logger.info("PDF firmado y escrito exitosamente.")

        return output_pdf

from jinja2 import Environment, FileSystemLoader
import pdfkit
from utils.logger import CustomLogger  # Importar CustomLogger

# Instancia de CustomLogger
logger = CustomLogger(__name__).logger

class PDFService:
    @staticmethod
    def create_pdf(comercio, sucursales, output_file="generated_comercio.pdf"):
        logger.info("Iniciando la generación del PDF.")

        # Cargar la plantilla y registrar la operación
        env = Environment(loader=FileSystemLoader('src/templates'))
        logger.info("Plantillas cargadas desde 'src/templates'.")

        template = env.get_template('comercio_template.html')
        logger.info("Plantilla 'comercio_template.html' cargada exitosamente.")

        # Renderizar la plantilla con los datos proporcionados y loguear los datos
        logger.info(f"Datos del comercio: {comercio}")
        logger.info(f"Datos de sucursales: {sucursales}")

        rendered_html = template.render(
            nombre_comercio=comercio['nombre'],
            categoria=comercio['categoria'],
            direccion=comercio['direccion'],
            telefono=comercio['telefono'],
            fecha_de_creacion=comercio['fecha_de_creacion'],
            sucursales=sucursales
        )
        logger.info("HTML renderizado exitosamente.")

        # Generar el PDF y registrar la operación
        pdfkit.from_string(rendered_html, output_file)
        logger.info(f"PDF generado y guardado en '{output_file}'.")

        return output_file

from jinja2 import Environment, FileSystemLoader
import pdfkit

class PDFService:
    @staticmethod
    def create_pdf(comercio, sucursales, output_file="generated_comercio.pdf"):
        env = Environment(loader=FileSystemLoader('src/templates'))
        template = env.get_template('comercio_template.html')

        rendered_html = template.render(
            nombre_comercio=comercio['nombre'],
            categoria=comercio['categoria'],
            direccion=comercio['direccion'],
            telefono=comercio['telefono'],
            fecha_de_creacion=comercio['fecha_de_creacion'],
            sucursales=sucursales
        )

        pdfkit.from_string(rendered_html, output_file)
        return output_file

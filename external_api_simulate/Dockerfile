# Usar una imagen base de Python con seguridad básica
FROM python:3.10-slim

# Instalar dependencias del sistema para la seguridad y soporte de PDF
RUN apt-get update && apt-get install -y \
    libssl-dev \
    libffi-dev \
    wkhtmltopdf \
    && rm -rf /var/lib/apt/lists/*

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar los archivos de proyecto
COPY external_api_simulate/ .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r src/requirements.txt

# Variables de entorno de Flask
ENV FLASK_APP=src/app.py
ENV FLASK_ENV=production

# Comando por defecto para iniciar la aplicación
CMD ["python", "src/app.py"]

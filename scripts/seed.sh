#!/bin/bash
# suit-local.sh
# Autor: Jorge Reyes
# Este script se encarga de inicializar los contenedores necesarios para la suite local de DynamoDB,
# cargar datos de prueba y levantar una API externa en Python, todo en un entorno de desarrollo local.

# Incluir funciones de utilidad
# Se importa el archivo que contiene las funciones principales para que puedan ser usadas en este script.
source scripts/commands/main.sh

# Función para inicializar los contenedores de la API externa en Python
# Argumentos:
#   1. Nombre del proyecto (opcional): Si se proporciona, se sobrescribe la variable "project_suit_name".
#   2. Ruta del archivo docker-compose que se usará para iniciar los contenedores.
#   3. Parámetros adicionales para docker-compose.
#   4. Mensaje de éxito que se muestra si la API externa se inicia correctamente.
#   5. Mensaje de error que se muestra si la inicialización falla.
init_external_api_python_suite_containers() {
    init_docker_containers \
        "python_sign_local_suite" \
        "./scripts/docker/docker-compose-external-api.yml" \
        "$1" \
        "External Api Python Iniciado." \
        "No se pudo iniciar Python. Verifica el archivo docker-compose."
    breakline  # Agrega una línea en blanco para mejorar la legibilidad en la salida del terminal.
}


# Función principal del script
# Argumentos:
#   1. Nombre del proyecto (opcional): Si se proporciona, sobrescribe la variable "project_suit_name".
main() {
    validate_environment  # Valida que el entorno tenga las dependencias y configuraciones necesarias.
    source_env_vars ".env.local.docker"  # Carga las variables de entorno del archivo .env específico.
    
    # Carga las variables de entorno necesarias para la API externa.
    source_env_vars "./external_api_simulate/.env"
    
    # Inicializa los contenedores de la API externa en Python.
    init_external_api_python_suite_containers "$1"
}

# Ejecuta la función principal y pasa todos los argumentos proporcionados al script.
main "$@"

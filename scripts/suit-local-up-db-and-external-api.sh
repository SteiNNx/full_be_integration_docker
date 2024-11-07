#!/bin/bash
# suit-local-up-db-and-external-api.sh
# Autor: Jorge Reyes
# Este script se encarga de inicializar los contenedores necesarios para la suite local de DynamoDB,
# cargar datos de prueba y levantar una API externa en Python, todo en un entorno de desarrollo local.

# Incluir funciones de utilidad
# Se importa el archivo que contiene las funciones principales para que puedan ser usadas en este script.
source scripts/commands/main.sh

# Función para inicializar los contenedores de DynamoDB localmente
# Argumentos:
#   1. Nombre del proyecto (opcional): Si se proporciona, se sobrescribe la variable "project_suit_name".
#   2. Ruta del archivo docker-compose que se usará para iniciar los contenedores.
#   3. Parámetros adicionales para docker-compose, como "--build" si es necesario.
#   4. Mensaje que se muestra si la inicialización de DynamoDB es exitosa.
#   5. Mensaje de error que se muestra si la inicialización falla.
init_dynamodb_suite_containers() {
    init_docker_containers \
        "dynamodb_local_suite" \
        "./scripts/docker/docker-compose-dynamodb.yml" \
        "$1" \
        "DynamoDB Iniciado." \
        "No se pudo iniciar DynamoDB. Verifica el archivo docker-compose."
    breakline  # Agrega una línea en blanco para mejorar la legibilidad en la salida del terminal.
}

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

# Función para inicializar una tabla de DynamoDB y cargar datos de prueba
# Argumentos:
#   1. Archivo de estructura de la tabla (JSON).
#   2. Archivo de datos de la tabla (JSON).
init_seed_dynamodb_table() {
    local structure_file="$1"  # Archivo JSON que contiene la estructura de la tabla.
    local data_file="$2"       # Archivo JSON que contiene los datos semilla.
    local endpoint="${AWS_DYNAMODB_ENDPOINT}"  # Endpoint de DynamoDB definido en las variables de entorno.
    
    # Llama a las funciones para crear la tabla y cargar los datos semilla.
    create_dynamodb_table "$structure_file" "$endpoint"
    seed_dynamodb_data "$data_file" "$endpoint"
    breakline  # Agrega una línea en blanco para mejorar la legibilidad en la salida del terminal.
}

# Función principal del script
# Argumentos:
#   1. Nombre del proyecto (opcional): Si se proporciona, sobrescribe la variable "project_suit_name".
main() {
    validate_environment  # Valida que el entorno tenga las dependencias y configuraciones necesarias.
    source_env_vars ".env.local.docker"  # Carga las variables de entorno del archivo .env específico.
    
    # Inicializa los contenedores de DynamoDB local.
    init_dynamodb_suite_containers
    
    # Inicializa y carga datos para la tabla "auth_tokens".
    init_seed_dynamodb_table "./scripts/dynamodb/auth_tokens.structure.json" "./scripts/dynamodb/auth_tokens.data.json"

    # Inicializa y carga datos para la tabla "comercios".
    init_seed_dynamodb_table "./scripts/dynamodb/comercios.structure.json" "./scripts/dynamodb/comercios.data.json"
    
    # Inicializa y carga datos para la tabla "sucursales".
    init_seed_dynamodb_table "./scripts/dynamodb/sucursales.structure.json" "./scripts/dynamodb/sucursales.data.json"

    # Carga las variables de entorno necesarias para la API externa.
    source_env_vars "./external_api_simulate/.env"
    
    # Inicializa los contenedores de la API externa en Python.
    init_external_api_python_suite_containers
}

# Ejecuta la función principal y pasa todos los argumentos proporcionados al script.
main "$@"

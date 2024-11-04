#!/bin/bash
# aws_dynamodb_functions.sh
# Autor: Jorge Reyes

# Crear tabla en DynamoDB utilizando la estructura definida
# Argumentos:
#   1. Archivo de estructura de la tabla (obligatorio)
#   2. Endpoint de DynamoDB (obligatorio)
create_dynamodb_table() {
    local structure_file="$1"
    local endpoint="$2"

    log "Creando tabla DynamoDB desde ${structure_file}..."

    # Ejecutar comando de AWS y capturar salida y errores
    output=$(aws dynamodb create-table \
        --cli-input-json file://"${structure_file}" \
        --endpoint-url "${endpoint}" \
        --no-cli-pager 2>&1) # Redirigir stderr a stdout

    if [ $? -eq 0 ]; then
        success "Tabla DynamoDB creada correctamente."
        log "aws-output-cli: $output" # Registrar la salida del comando en el archivo de log
        breakline
    else
        log "aws-output-cli: $output" # Registrar el error en el archivo de log
        critical_error "Error al crear la tabla en DynamoDB."
    fi
}

# Cargar datos semilla en DynamoDB utilizando batch-write-item con --cli-input-json
# Argumentos:
#   1. Archivo de datos (obligatorio)
#   2. Endpoint de DynamoDB (obligatorio)
seed_dynamodb_data() {
    local data_file="$1"
    local endpoint="$2"

    log "Cargando datos de semilla desde ${data_file}..."

    # Leer el contenido del archivo y usarlo como input JSON
    local json_input
    json_input=$(cat "${data_file}")

    # Verificar si json_input se cargó correctamente
    if [ -z "$json_input" ]; then
        critical_error "Error al leer el archivo ${data_file}. El archivo está vacío o no es válido."
        return 1
    fi

    # Establecer la variable de entorno PYTHONUTF8=1 y ejecutar el comando de AWS
    output=$(PYTHONUTF8=1 aws dynamodb batch-write-item \
        --cli-input-json "${json_input}" \
        --endpoint-url "${endpoint}" \
        --no-cli-pager 2>&1) # Redirigir stderr a stdout

    if [ $? -eq 0 ]; then
        success "Datos de semilla cargados correctamente."
        log "aws-output-cli: $output" # Registrar la salida del comando en el archivo de log
        breakline
    else
        log "$output" # Registrar el error en el archivo de log
        critical_error "Error al cargar los datos de semilla en DynamoDB."
    fi
}


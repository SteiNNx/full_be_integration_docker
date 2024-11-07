#!/bin/bash
# suit-local-up-db-and-external-api.sh
# Autor: Jorge Reyes
# Este script se encarga de inicializar los contenedores necesarios para la suite local de DynamoDB,
# cargar datos de prueba y levantar una API externa en Python, todo en un entorno de desarrollo local.

# Incluir funciones de utilidad
# Se importa el archivo que contiene las funciones principales para que puedan ser usadas en este script.
source scripts/commands/main.sh

run_node() {  
    echo "Iniciando la aplicación principal..."
    npm start
}

# @function main
# @description Función principal que ejecuta la acción basada en los argumentos proporcionados.
# @param {string} [env_file=".env"] - (Opcional) Archivo de variables de entorno. Usa `.env` por defecto.
# @param {string} [action="run_node"] - (Opcional) Acción a ejecutar. Usa `run_node` por defecto.
# @example
#   main .env
main() {
    validate_environment  # Valida que el entorno tenga las dependencias y configuraciones necesarias.
    local env_file=".env.local.docker"  # Valor predeterminado para el archivo de variables de entorno
    local action="run_node"  # Acción predeterminada

    # Cargar las variables de entorno
    source_env_vars "$env_file"
    
    # Ejecutar la acción definida
    $action  
}

# @description Llama a la función principal con los argumentos de línea de comandos.
# @example
#   ./run.sh
main "$@"

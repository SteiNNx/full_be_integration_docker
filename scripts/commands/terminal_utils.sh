#!/bin/bash
# terminal_utils.sh
# Autor: Jorge Reyes

# === Sección: Declaración de colores ===
# Colores para la terminal
declare COLOR_RESET="\e[0m"          # Resetear color al finalizar
declare COLOR_BOLD="\e[1m"           # Texto en negrita
declare COLOR_INFO="\e[36m"          # Cyan para información
declare COLOR_LOG="\e[94m"           # Azul claro para mensajes generales
declare COLOR_SUCCESS="\e[92m"       # Verde para éxito
declare COLOR_WARNING="\e[33m"       # Amarillo para advertencias
declare COLOR_ERROR="\e[91m"         # Rojo para errores

# === Sección: Funciones de mensajes ===

# Función para imprimir mensajes informativos
# Argumentos:
#   1. Mensaje (obligatorio): El texto del mensaje que se mostrará.
info() {
    echo -e "${COLOR_INFO}[INFO] ${COLOR_BOLD}$1${COLOR_RESET}"
}

# Función para imprimir mensajes generales
# Argumentos:
#   1. Mensaje (obligatorio): El texto del mensaje que se mostrará.
log() {
    echo -e "${COLOR_LOG}[LOG] ${COLOR_BOLD}$1${COLOR_RESET}"
}

# Función para imprimir mensajes de éxito
# Argumentos:
#   1. Mensaje (obligatorio): El texto del mensaje que se mostrará.
success() {
    echo -e "${COLOR_SUCCESS}[SUCCESS] ${COLOR_BOLD}$1${COLOR_RESET}"
}

# Función para imprimir mensajes de advertencia
# Argumentos:
#   1. Mensaje (obligatorio): El texto del mensaje que se mostrará.
warning() {
    echo -e "${COLOR_WARNING}[WARNING] ${COLOR_BOLD}$1${COLOR_RESET}"
}

# Función para imprimir mensajes de error
# Argumentos:
#   1. Mensaje (obligatorio): El texto del mensaje que se mostrará.
error() {
    echo -e "${COLOR_ERROR}[ERROR] ${COLOR_BOLD}$1${COLOR_RESET}"
}

# Función para imprimir mensajes de error crítico y salir
# Argumentos:
#   1. Mensaje (obligatorio): El texto del mensaje que se mostrará antes de salir del script.
critical_error() {
    echo -e "${COLOR_ERROR}[CRITICAL ERROR] ${COLOR_BOLD}$1${COLOR_RESET}"
    exit 1
}

# Función para imprimir mensajes de depuración (solo si DEBUG_MODE está activado)
# Argumentos:
#   1. Mensaje (obligatorio): El texto del mensaje de depuración que se mostrará.
debug() {
    if [ "$DEBUG_MODE" = "true" ]; then
        echo -e "${COLOR_INFO}[DEBUG] ${COLOR_BOLD}$1${COLOR_RESET}"
    fi
}

# === Sección: Funciones de utilidad ===

# Función para imprimir líneas de separación
# Argumentos:
#   1. Número de líneas (opcional): Cuántas líneas en blanco imprimir. Por defecto es 1.
breakline() {
    local lines=${1:-1}
    for ((i = 0; i < lines; i++)); do
        echo ""
    done
}

# Función para cargar variables de entorno desde un archivo .env
# Argumentos:
#   1. Ruta del archivo .env (obligatorio): El archivo de donde cargar las variables de entorno.
source_env_vars() {
    local env_file="$1"
    
    if [ -f "$env_file" ]; then
        # Cargar variables de entorno desde el archivo
        export $(grep -v '^#' "$env_file" | xargs)
        
        # Mensaje de éxito
        info "Variables de entorno cargadas desde $env_file."
        breakline
    else
        # Mensaje de error crítico si no se encuentra el archivo
        critical_error "Archivo $env_file no encontrado. Verifica su existencia y ubicación."
    fi
}

# Función para registrar un mensaje en un archivo de registro
# Argumentos:
#   1. Mensaje (obligatorio): El mensaje a registrar.
#   2. Nombre del archivo de log (opcional): El archivo donde se registrará el mensaje. Por defecto es "script.log".
log_file() {
    local log_file=${2:-"script.log"}
    echo -e "$(date +'%Y-%m-%d %H:%M:%S') - $1" >>"$log_file"
}

# Función para verificar la versión de un comando instalado
# Argumentos:
#   1. Comando (obligatorio): El comando que se va a verificar.
#   2. Etiqueta (obligatorio): Nombre descriptivo del comando para los mensajes.
check_command_version() {
    local command=$1
    local label=$2
    
    if command -v $command &>/dev/null; then
        # Obtener la versión del comando
        local version=$($command --version)
        
        # Mensaje informativo con la versión
        log "$label: $version"
    else
        # Mensaje de advertencia si el comando no está instalado
        log "$label no está instalado. Por favor, instálalo para asegurar el correcto funcionamiento del sistema."
    fi
}

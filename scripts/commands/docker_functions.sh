#!/bin/bash
# docker_functions.sh
# Autor: Jorge Reyes

# Validar Docker y Docker Compose
# Sin argumentos. Valida si Docker y Docker Compose están instalados y activos.
validate_environment() {
    log "Validando Docker y Docker Compose..."
    breakline
    validate_docker_and_compose
    log "Validación completa."
    breakline
}

# Función para validar Docker y Docker Compose
# Sin argumentos. Valida Docker y Docker Compose dependiendo del sistema operativo.
validate_docker_and_compose() {
    # Validar Docker
    if ! command -v docker &>/dev/null; then
        critical_error "Docker no está instalado. Instálalo antes de continuar."
        return
    fi

    case "$OSTYPE" in
        linux-gnu*)
            systemctl is-active --quiet docker || critical_error "Docker no está activo. Inícialo antes de continuar."
            ;;
        darwin*)
            pgrep -x "Docker" >/dev/null || critical_error "Docker no está activo. Inícialo antes de continuar."
            ;;
        msys*)
            docker info >/dev/null 2>&1 || critical_error "Docker no está activo. Inícialo antes de continuar."
            ;;
        *)
            critical_error "Sistema operativo no compatible."
            return
            ;;
    esac

    # Validar Docker Compose
    if ! command -v docker-compose &>/dev/null; then
        critical_error "docker-compose no está instalado. Consulta la documentación para instalarlo."
        return
    fi

    # Mensaje de éxito si todo está correcto
    info "Docker y docker-compose están instalados y funcionando correctamente."
    breakline
}

# Limpiar contenedores y volúmenes
# Argumentos:
#   1. Nombre del proyecto (obligatorio): El nombre del proyecto de Docker.
#   2. Flag de build (opcional): Indica si se debe hacer un build (`--build`) o prune (`--prune`).
#   3. Archivo docker-compose (obligatorio): La ruta al archivo docker-compose a utilizar.
cleanup_docker() {
    local project_name="$1"
    local build_flag="$2"
    local compose_file="$3"
    log "Iniciando limpieza de contenedores..."
    breakline

    if [ "$build_flag" == "--build" ]; then
        # Limpiar contenedores, volúmenes y orfanatos
        docker-compose -p "${project_name}" -f "${compose_file}" down --volumes --remove-orphans
        log "Contenedores, volúmenes y orfanatos limpiados."

    else
        # Limpiar solo contenedores
        docker-compose -p "${project_name}" -f "${compose_file}" down
        log "Contenedores limpiados."
    fi
    breakline
}

# Inicializar contenedores usando docker-compose
# Argumentos:
#   1. Nombre del proyecto (obligatorio): El nombre del proyecto de Docker.
#   2. Archivo docker-compose (obligatorio): La ruta al archivo docker-compose a utilizar.
#   3. Flag de build (opcional): Indica si se debe hacer un build (`--build`).
#   4. Mensaje de éxito al iniciar los contenedores (obligatorio).
#   5. Mensaje de error en caso de fallo (obligatorio).
init_docker_containers() {
    local project_name="$1"
    local compose_file="$2"
    local build_flag="$3"
    local success_message="$4"
    local failure_message="$5"

    log "Iniciando contenedores de ${project_name}..."
    breakline
    cleanup_docker "$project_name" "$build_flag" "$compose_file"
    docker-compose -p "${project_name}" -f "${compose_file}" up ${build_flag} -d || {
        critical_error "${failure_message}"
    }
    breakline
    success "${success_message}"
    breakline
}

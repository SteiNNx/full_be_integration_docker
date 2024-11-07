const loggerBECH = require("@bech/logger");

/**
 * Clase LoggerUtils.
 * 
 * Esta clase proporciona una interfaz para manejar registros (logs) utilizando el logger BECH. Permite registrar mensajes con distintos niveles de severidad, tales como: info, warn, error, debug, trace y fatal. 
 * Cada método recibe un mensaje o datos a registrar, lo que facilita el seguimiento y la depuración de eventos y errores en diferentes módulos.
 * 
 * @class
 */
class LoggerUtils {
    /**
     * Crea una nueva instancia de LoggerUtils para un módulo específico.
     * 
     * @param {string} moduleName - Nombre del módulo o componente utilizado para identificar los registros generados.
     * @throws {Error} Si el nombre del módulo no es un string válido.
     * 
     * @example
     * const logger = new LoggerUtils('auth.controller');
     */
    constructor(moduleName) {
        if (!moduleName || typeof moduleName !== 'string') {
            throw new Error('Log: El nombre del módulo debe ser un string.');
        }

        /**
         * @property {Object} logger - Instancia de BECH logger con la configuración del módulo.
         */
        this.logger = loggerBECH.getLogger({ name: moduleName });
    }

    /**
     * Registra un mensaje con nivel informativo (info).
     * 
     * @param {Object|string} message - Mensaje o datos a registrar.
     * @example
     * logger.info('Iniciando proceso de autenticación');
     */
    info(message) {
        this.logger.info({ msg: message });
    }

    /**
     * Registra un mensaje con nivel de advertencia (warn).
     * 
     * @param {Object|string} message - Mensaje o datos a registrar.
     * @example
     * logger.warn('Este proceso puede tardar más de lo esperado');
     */
    warn(message) {
        this.logger.warn({ msg: message });
    }

    /**
     * Registra un mensaje con nivel de error (error).
     * 
     * @param {Object|string} message - Mensaje o datos a registrar.
     * @example
     * logger.error('Error al conectar con la base de datos');
     */
    error(message) {
        this.logger.error({ msg: message });
    }

    /**
     * Registra un mensaje con nivel de depuración (debug).
     * 
     * @param {Object|string} message - Mensaje o datos a registrar.
     * @example
     * logger.debug('Valor actual de la variable de configuración: X');
     */
    debug(message) {
        this.logger.debug({ msg: message });
    }

    /**
     * Registra un mensaje con nivel de traza (trace).
     * 
     * @param {Object|string} message - Mensaje o datos a registrar.
     * @example
     * logger.trace('Iniciando la traza del proceso de autenticación');
     */
    trace(message) {
        this.logger.trace({ msg: message });
    }

    /**
     * Registra un mensaje con nivel fatal (fatal).
     * 
     * @param {Object|string} message - Mensaje o datos a registrar.
     * @example
     * logger.fatal('Falló el proceso crítico del sistema');
     */
    fatal(message) {
        this.logger.fatal({ msg: message });
    }
}

module.exports = LoggerUtils;

/**
 * Clase base para implementar IBaseError.
 * Extiende la clase de Error de JavaScript y añade propiedades personalizadas para manejar errores específicos.
 * 
 * @class
 * @extends Error
 * 
 * @param {Object} options - Opciones para configurar el error.
 * @param {string} options.message - El mensaje de error.
 * @param {string} options.code - El código específico del error.
 * @param {string} [options.name='BaseError'] - El nombre del error (opcional).
 * @param {number} [options.statusCode=500] - El código de estado HTTP (opcional, por defecto 500).
 * @param {Error} [options.cause] - La causa original del error (opcional).
 * @param {Array<Object>} [options.errors=[]] - Lista adicional de errores relacionados (opcional).
 * 
 * @example
 * // Ejemplo completo con todos los parámetros
 * const causeError = new Error('Error original'); // Error que será la causa original
 * 
 * const baseError = new BaseError({
 *   message: 'Ha ocurrido un error en el sistema', // Mensaje descriptivo del error
 *   code: 'BASE.001', // Código de error específico
 *   name: 'CustomBaseError', // Nombre personalizado para el error
 *   statusCode: 400, // Código de estado HTTP
 *   cause: causeError, // Error original que causó este error
 *   errors: [ // Lista adicional de errores
 *     { field: 'nombre', message: 'El nombre es requerido' },
 *     { field: 'email', message: 'El correo no es válido' }
 *   ]
 * });
 * 
 * throw baseError;
 * 
 * @output
 * // {
 * //   "name": "CustomBaseError",
 * //   "code": "BASE.001",
 * //   "message": "Ha ocurrido un error en el sistema",
 * //   "statusCode": 400,
 * //   "errors": [
 * //     { "field": "nombre", "message": "El nombre es requerido" },
 * //     { "field": "email", "message": "El correo no es válido" }
 * //   ],
 * //   "cause": "Error original",
 * //   "stack": "BaseError: Ha ocurrido un error en el sistema..."
 * // }
 */
class BaseError extends Error {
    constructor({ message, code, name, statusCode, cause, errors = [] }) {
        super(message);
        this.code = code;
        this.name = name || 'BaseError'; // Nombre del error
        this.statusCode = statusCode || 500; // Código HTTP, por defecto 500
        this.errors = errors; // Lista de errores adicionales
        this.cause = cause; // Causa original del error si existe

        // Incluir la causa en el stack trace si se proporciona
        if (cause instanceof Error) {
            this.stack += `\nCaused by: ${cause.stack}`;
        }
    }
}

/**
 * Clase para manejar errores de negocio.
 * Utiliza el código de estado HTTP 500 (INTERNAL_SERVER_ERROR).
 * 
 * @class
 * @extends BaseError
 * 
 * @param {string} code - Código específico del error de negocio.
 * @param {string} message - Mensaje descriptivo del error de negocio.
 * @param {Error} [cause] - Causa original del error (opcional).
 * 
 * @example
 * throw new BusinessError('BUSINESS.001', 'Ocurrió un error de negocio 001.');
 * throw new BusinessError('BUSINESS.002', 'Ocurrió un error de negocio 002.', 404);
 * @output
 * // {
 * //   "name": "BusinessError",
 * //   "code": "BUSINESS.001",
 * //   "message": "Ocurrió un error de negocio 001.",
 * //   "statusCode": 500
 * // },
 * // {
 * //   "name": "BusinessError",
 * //   "code": "BUSINESS.002",
 * //   "message": "Ocurrió un error de negocio 002.",
 * //   "statusCode": 404
 * // }
 */
class BusinessError extends BaseError {
    constructor(code, message, statusCode = 500, cause) {
        super({
            message,
            code,
            name: 'BusinessError',
            statusCode: statusCode,
            cause
        });
    }
}

/**
 * Clase para manejar errores técnicos.
 * Utiliza el código de estado HTTP 500 (INTERNAL_SERVER_ERROR).
 * 
 * @class
 * @extends BaseError
 * 
 * @param {string} code - Código específico del error técnico.
 * @param {string} message - Mensaje descriptivo del error técnico.
 * @param {Error} [cause] - Causa original del error (opcional).
 * 
 * @example
 * throw new TechnicalError('TECH.001', 'Ocurrió un error técnico.');
 * 
 * @output
 * // {
 * //   "name": "TechnicalError",
 * //   "code": "TECH.001",
 * //   "message": "Ocurrió un error técnico.",
 * //   "statusCode": 500
 * // }
 */
class TechnicalError extends BaseError {
    constructor(code, message, cause) {
        super({
            message,
            code,
            name: 'TechnicalError',
            statusCode: 500,
            cause
        });
    }
}

/**
 * Clase para manejar errores de validación.
 * Utiliza el código de estado HTTP 400 (BAD_REQUEST).
 * 
 * @class
 * @extends BaseError
 * 
 * @param {string} code - Código específico del error de validación.
 * @param {string} message - Mensaje descriptivo del error de validación.
 * @param {Error} [cause] - Causa original del error (opcional).
 * @param {Array<Object>} [errors=[]] - Lista adicional de errores de validación (opcional).
 * 
 * @example
 * throw new ValidationError('VALIDATION.001', 'El campo nombre es obligatorio.');
 * 
 * @output
 * // {
 * //   "name": "ValidationError",
 * //   "code": "VALIDATION.001",
 * //   "message": "El campo nombre es obligatorio.",
 * //   "statusCode": 400,
 * //   "errors": []
 * // }
 */
class ValidationError extends BaseError {
    constructor(code, message, cause, errors = []) {
        super({
            message,
            code,
            name: 'ValidationError',
            statusCode: 400,
            cause,
            errors
        });
    }
}

/**
 * Clase para manejar errores de autenticación.
 * Utiliza el código de estado HTTP 401 (UNAUTHORIZED).
 * 
 * @class
 * @extends BaseError
 * 
 * @param {string} code - Código específico del error de autenticación.
 * @param {string} message - Mensaje descriptivo del error de autenticación.
 * @param {Error} [cause] - Causa original del error (opcional).
 * 
 * @example
 * throw new AuthError('AUTH.001', 'Token de autenticación inválido.');
 * 
 * @output
 * // {
 * //   "name": "AuthError",
 * //   "code": "AUTH.001",
 * //   "message": "Token de autenticación inválido.",
 * //   "statusCode": 401
 * // }
 */
class AuthError extends BaseError {
    constructor(code, message, cause) {
        super({
            message,
            code,
            name: 'AuthError',
            statusCode: 401,
            cause
        });
    }
}

/**
 * Clase para manejar errores de adaptadores o integraciones externas.
 * Utiliza el código de estado HTTP 502 (BAD_GATEWAY).
 * 
 * @class
 * @extends BaseError
 * 
 * @param {string} code - Código específico del error de adaptador.
 * @param {string} message - Mensaje descriptivo del error de adaptador.
 * @param {Error} [cause] - Causa original del error (opcional).
 * 
 * @example
 * throw new AdapterError('ADAPTER.001', 'Error al conectarse con el servicio externo.');
 * 
 * @output
 * // {
 * //   "name": "AdapterError",
 * //   "code": "ADAPTER.001",
 * //   "message": "Error al conectarse con el servicio externo.",
 * //   "statusCode": 502
 * // }
 */
class AdapterError extends BaseError {
    constructor(code, message, cause) {
        super({
            message,
            code,
            name: 'AdapterError',
            statusCode: 502,
            cause
        });
    }
}

// Exportar las clases de error
module.exports = {
    BaseError,
    BusinessError,
    TechnicalError,
    ValidationError,
    AuthError,
    AdapterError
};

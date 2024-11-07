const {
    BusinessError,
    TechnicalError,
    ValidationError,
    AuthError
} = require('../exceptions/base.exceptions');
const { OutputMessage } = require('../schemas/OutputMessage.schema');
const { monitoring } = require('../utils/monitoring.utils');


/**
 * Middleware para manejo de excepciones dentro de controladores.
 * Proporciona logs detallados para monitoreo y seguimiento.
 * 
 * @param {Error|Promise} err - El error capturado por el middleware, puede ser un error normal o una promesa rechazada.
 * @param {object} req - El objeto de solicitud HTTP.
 * @param {object} res - El objeto de respuesta HTTP.
 * @param {function} next - La función para pasar al siguiente middleware.
 * @returns {void}
 */
const errorHandlerMiddleware = async (err, req, res, next) => {

    try {
        // Si el error es una promesa, esperar su resolución o rechazo
        if (err instanceof Promise) {
            try {
                err = await err;
            } catch (rejectedError) {
                err = rejectedError;
            }
        }

        // Generar un Request ID para trazabilidad si no existe
        const requestId = req.headers['xrequestid'] || req.headers['xtrackid'];

        // Información relevante de la solicitud
        const { body, headers, method, originalUrl } = req;

        // Verificación y transformación de headers y body en cadenas de texto planas (una línea)
        const formattedHeaders = headers && typeof headers === 'object'
            ? JSON.stringify(headers).replace(/\s+/g, ' ')
            : 'No disponible';

        const formattedBody = body && typeof body === 'object'
            ? JSON.stringify(body).replace(/\s+/g, ' ')
            : 'No disponible';

        // Log de todos los atributos del error
        console.error('Detalles del error:');
        Object.entries(err).forEach(([key, value]) => {
            console.error(`${key}: ${value}`);
        });

        //const { ZodError } = require('zod');

        //if (error instanceof ZodError) {
        //    const errorMessages = error.errors.map((err) => err.message);
        //    return res.status(400).json(new OutputMessage(400, "Error de validación", { errors: errorMessages }));
        //}

        // Manejar errores de `express-openapi-validator` usando el nombre del error
        if (err.errors && err.errors.length) {
            // Manejo de errores de validación generados por OpenAPI Validator
            const customError = new ValidationError(
                'CQR.VAL.001',
                'Validación de esquema fallida',
                err,
                err.errors
            );
            err = customError;
        }

        // Desestructurar el objeto de error con valores predeterminados
        const {
            statusCode = 500,
            name = 'ErrorHandlerMiddleware',
            code = 'CQR.MDW.001',
            message = 'Error interno del servidor',
            cause = null,
            stack = null,
        } = err;

        const fullMessageErrorLog = `
        ───────────────────────────────────────────
        🕒 Fecha y hora: ${new Date().toISOString()}
        🆔 Request ID: ${requestId}
        📟 HTTP Code Response: ${statusCode}
        ⚠️ Código de error: ${code}
        📛 Tipo de error: ${name}
        📝 Mensaje de error: ${message}
        🔗 Endpoint: ${method} ${originalUrl}
        📦 Body: ${formattedBody}
        🗂️ Headers: ${formattedHeaders}
        ───────────────────────────────────────────`;

        // Log detallado con información del error
        console.error(fullMessageErrorLog);
        // Monitoreo log becj
        monitoring(code, { message: fullMessageErrorLog });

        // Manejo de errores basado en el tipo de error usando un switch
        switch (true) {
            case err instanceof ValidationError:
                console.warn('🟡 Error de validación:', err.errors || err.message);
                break;
            case err instanceof AuthError:
                console.warn('🔒 Error de autenticación:', err.message);
                break;
            case err instanceof BusinessError:
                console.warn('🔄 Error de negocio:', err.message);
                break;
            case err instanceof TechnicalError:
                console.error('⚙️ Error técnico:', err.message);
                break;
            default:
                console.error('❗ Error no clasificado:', err.message);
                break;
        }

        // Log adicional si existen causa o stack trace
        if (cause) {
            console.error('🔍 Causa del error:', cause);
        }
        if (stack) {
            console.error('🔗 Stack trace:', stack);
        }

        // Crear la respuesta usando la clase OutputMessage
        const responseOutputMessage = new OutputMessage(
            false,                           // Éxito: falso ya que es un error
            message,                         // Mensaje de error
            null,                            // Sin datos de respuesta
            {                                // Detalles del error
                name,
                statusCode,
                code,
                details: cause || stack || message
            }
        );

        // Establecer encabezados adicionales si es necesario
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('x-request-id', requestId);  // Adjuntar el Request ID en la respuesta

        // Enviar la respuesta al cliente
        res.status(statusCode).json(responseOutputMessage);
    } catch (unexpectedError) {
        // Manejar cualquier error inesperado en el middleware
        console.error('Error inesperado en el middleware de manejo de errores:', unexpectedError.message);
        next(unexpectedError);
    }
};

module.exports = errorHandlerMiddleware;
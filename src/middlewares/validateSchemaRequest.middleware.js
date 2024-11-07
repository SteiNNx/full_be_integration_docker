// src/middlewares/validateRequest.middleware.js
const { ZodError } = require('zod');
const { OutputMessage } = require('../schemas/OutputMessage.schema');

/**
 * Middleware para validar las solicitudes de acuerdo con el esquema proporcionado.
 *
 * @param {z.ZodSchema} schema - Esquema de `zod` para validar la solicitud.
 * @returns {Function} Middleware de validación.
 */
function validateSchemaRequestMiddleware(schema) {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((err) => err.message);
                return res.status(400).json(new OutputMessage(400, "Error de validación", { errors: errorMessages }));
            }
            next(error);
        }
    };
}

module.exports = validateSchemaRequestMiddleware;

const { monitoring } = require('../utils/monitoring.utils');

/**
 * Middleware para monitorear todas las peticiones HTTP que ingresen a la aplicación.
 *
 * Sobrescribe el método `sendStatus` de Express para permitir que se ejecute la función de monitoreo
 * antes de enviar la respuesta al cliente. El monitoreo se ejecuta solo si está habilitado.
 *
 * @param {object} app - La instancia de la aplicación Express.
 * @example
 * // En tu aplicación Express:
 * const express = require('express');
 * const app = express();
 * const requestMonitoringMiddleware = require('./middlewares/requestMonitoringMiddleware');
 * 
 * // Configurar el middleware de monitoreo
 * requestMonitoringMiddleware(app);
 * 
 * // Definir una ruta
 * app.post('/api/sucursales', (req, res) => {
 *   res.sendStatus(200, '200.GAS', { message: 'Sucursales obtenidas correctamente' });
 * });
 * 
 * // Iniciar el servidor
 * app.listen(3000, () => {
 *   console.log('Servidor corriendo en el puerto 3000');
 * });
 */
const requestMonitoringMiddleware = (app) => {
    /**
     * Sobrescribe el método `sendStatus` para incluir monitoreo en las respuestas HTTP.
     * 
     * @param {number} statusCode - El código HTTP (por ejemplo, 200, 404, 500).
     * @param {string} code - El código de monitoreo para identificar la operación realizada.
     * @param {object} [message={}] - Un objeto personalizado que contiene el mensaje de respuesta.
     * @param {boolean} [monitor=true] - Si es `true`, ejecuta la función de monitoreo antes de enviar la respuesta.
     * 
     * @returns {object} - La respuesta del servidor Express con el código de estado y el mensaje.
     */
    app.response.sendStatus = function (statusCode, code, message = {}, monitor = true) {
        if (monitor) {
            // Ejecutar la función de monitoreo si está habilitada
            monitoring(code, { ...message });
        }

        // Responder con el código de estado y el mensaje personalizado
        return this.contentType('application/json')
            .status(statusCode)
            .send(message);
    };
};

module.exports = requestMonitoringMiddleware;

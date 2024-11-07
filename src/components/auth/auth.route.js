// src/components/auth/auth.routes.js

const {
    getUserByUsernameController,
    saveUserController,
    updateAuthTokenController,
} = require('./auth.controller');

const LoggerUtils = require('../../utils/logger.utils');
const setHeadersMiddleware = require('../../middlewares/setHeaders.middleware');
const validateSchemaRequestMiddleware = require('../../middlewares/validateSchemaRequest.middleware');
const {
    getUserByUsernameSchemaRequest,
    saveUserSchemaRequest,
    updateAuthTokenSchemaRequest,
} = require('../../validations/auth.schema');

const logger = new LoggerUtils('auth.routes');

/**
 * Configura y registra las rutas de autenticación en la aplicación Express.
 * 
 * @param {Object} app - Instancia de la aplicación Express.
 * @param {string} globalPathPrefix - Prefijo de ruta global que se añadirá a cada endpoint de autenticación.
 * 
 * @description
 * Esta función define y registra las rutas de autenticación directamente en la aplicación Express. 
 * Cada ruta utiliza el middleware `setHeadersMiddleware` para añadir encabezados personalizados a las solicitudes, 
 * y se registra un mensaje en el log detallando el método, la ruta, y el controlador correspondiente.
 * 
 * Al iniciar y finalizar la configuración de las rutas, se registran mensajes informativos en el log.
 * 
 * @example
 * const express = require('express');
 * const authRoutes = require('./components/auth/auth.routes');
 * 
 * const app = express();
 * const PORT = 3000;
 * 
 * // Configuración de rutas de autenticación con el prefijo '/api'
 * authRoutes(app, '/api');
 * 
 * // Iniciar el servidor
 * app.listen(PORT, () => {
 *     console.log(`Servidor iniciado en http://localhost:${PORT}`);
 * });
 * 
 * @output
 * // Esto registrará las rutas en los logs:
 * // [INFO] auth.routes - Iniciando configuración de rutas para [authRoutes] con prefijo: /api
 * // [INFO] auth.routes - [REGISTERED ROUTE] [GET] /api/user/:username - auth.controller: getUserByUsernameController
 * // [INFO] auth.routes - [REGISTERED ROUTE] [POST] /api/user - auth.controller: saveUserController
 * // [INFO] auth.routes - [REGISTERED ROUTE] [PUT] /api/user/token - auth.controller: updateAuthTokenController
 * // [INFO] auth.routes - Configuración de rutas completada para [authRoutes] con prefijo: /api
 */
function authRoutes(app, globalPathPrefix) {
    logger.info(`Iniciando configuración de rutas para [authRoutes] con prefijo: ${globalPathPrefix}`);

    // Definir y registrar cada ruta directamente con log detallado de cada acción
    app.get(
        `${globalPathPrefix}/user/:username`,
        setHeadersMiddleware('Autenticación', 'Consulta', 'getUserByUsernameController'),
        validateSchemaRequestMiddleware(getUserByUsernameSchemaRequest),
        getUserByUsernameController
    );
    logger.info(`[REGISTERED ROUTE] [GET] ${globalPathPrefix}/user/:username - auth.controller: getUserByUsernameController`);

    app.post(
        `${globalPathPrefix}/user`,
        setHeadersMiddleware('Autenticación', 'Creación', 'saveUserController'),
        validateSchemaRequestMiddleware(saveUserSchemaRequest),
        saveUserController
    );
    logger.info(`[REGISTERED ROUTE] [POST] ${globalPathPrefix}/user - auth.controller: saveUserController`);

    app.put(
        `${globalPathPrefix}/user/token`,
        setHeadersMiddleware('Autenticación', 'Actualización', 'updateAuthTokenController'),
        validateSchemaRequestMiddleware(updateAuthTokenSchemaRequest),
        updateAuthTokenController
    );
    logger.info(`[REGISTERED ROUTE] [PUT] ${globalPathPrefix}/user/token - auth.controller: updateAuthTokenController`);

    logger.info(`Configuración de rutas completada para [authRoutes] con prefijo: ${globalPathPrefix}`);
}

module.exports = authRoutes;

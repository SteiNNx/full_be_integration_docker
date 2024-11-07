// src/routes.js

const authRoutes = require('../components/auth/auth.routes');
const config = require('../config/config');
const httpContext = require('@bech/express-http-context');
const { configurarMonitoreo } = require('@bech/monitoreo');
const LoggerUtils = require('../utils/LoggerUtils');

const logger = new LoggerUtils('routes');

/**
 * Configura las rutas y middlewares globales de la aplicación.
 * 
 * @param {Object} app - Instancia de la aplicación Express.
 * 
 * @description
 * Esta función configura los middlewares globales para el contexto de solicitud y monitoreo,
 * además de registrar las rutas de autenticación con el prefijo definido en la configuración.
 * Se proporciona un logging detallado para cada paso de la configuración.
 * 
 * @example
 * const express = require('express');
 * const { routes } = require('./src/routes');
 * 
 * const app = express();
 * routes(app);
 */
function routes(app) {
    const {
        app: { prefixUrlApi },
        monitoreo: { tipoPieza, nombrePieza },
    } = config;

    // Logging del inicio de configuración
    logger.info('Iniciando configuración de middlewares globales y rutas');

    // Middleware de contexto de solicitud
    app.use(httpContext.middleware);
    logger.info('Middleware httpContext configurado');

    // Middleware de monitoreo
    app.use(configurarMonitoreo(tipoPieza, nombrePieza));
    logger.info(`Middleware de monitoreo configurado: tipoPieza=${tipoPieza}, nombrePieza=${nombrePieza}`);

    // Configuración de rutas de autenticación con prefijo
    authRoutes(app, prefixUrlApi);
    logger.info(`Rutas de autenticación configuradas con prefijo: ${prefixUrlApi}`);

    // Logging de finalización de configuración
    logger.info('Configuración de middlewares y rutas completada');
}

module.exports = { routes };

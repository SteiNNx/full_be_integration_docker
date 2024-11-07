// src/app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const errorHandlerMiddleware = require('./middlewares/errorHandler.middleware');   // Manejo centralizado de errores
const requestMonitoringMiddleware = require('./middlewares/requestMonitoring.middleware');
const LoggerUtils = require('./utils/logger.utils');
const { routes } = require('./routes/routes');
const config = require('./config/config');

// Inicialización y configuración de variables
const app = express();
const logger = new LoggerUtils('app');
const { app: { port } } = config;

logger.info('Iniciando configuración de la aplicación');

// 1. Configuración de Seguridad y Análisis de Solicitudes
// ----------------------------------------------------------------
// Configuración de seguridad con Helmet
app.use(helmet());
app.use(helmet.hsts({
    maxAge: 60 * 60 * 24 * 365,  // Un año en segundos
    includeSubDomains: true,
    preload: true
}));
logger.info('Middleware Helmet configurado con HSTS');

// Deshabilitar encabezado 'x-powered-by' para mayor seguridad
app.disable('x-powered-by');

// Middleware para análisis de JSON en el cuerpo de la solicitud
app.use(bodyParser.json());
logger.info('Middleware BodyParser configurado para analizar JSON');

// Configuración de CORS
app.use(cors());
logger.info('Middleware CORS configurado');


// 2. Configuración de Rutas
// ----------------------------------------------------------------
routes(app);
logger.info('Rutas configuradas');


// 3. Configuración de Monitoreo y Manejo de Errores
// ----------------------------------------------------------------
// Middleware de monitoreo de solicitudes
requestMonitoringMiddleware(app);
logger.info('Middleware de monitoreo de solicitudes configurado');

// Middleware de manejo centralizado de errores
app.use(errorHandlerMiddleware);
logger.info('Middleware de manejo de errores configurado');

logger.info('Configuración de la aplicación completada');


// 4. Inicio del Servidor
// ----------------------------------------------------------------
app.listen(port, () => {
    logger.info(`Servidor iniciado y escuchando en http://localhost:${port}`);
});

module.exports = { app };

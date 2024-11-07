// src/app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const config = require('./config/config');
const { routes } = require('./routes/routes');
const LoggerUtils = require('./utils/LoggerUtils');

// Obtener configuraciones
const { app: { port } } = config;

const app = express();
const logger = new LoggerUtils('app');

// Configuración de seguridad con Helmet
logger.info('Iniciando configuración de seguridad con Helmet');
app.use(helmet());
logger.info('Middleware Helmet configurado');

app.use(helmet.hsts({
    maxAge: 60 * 60 * 24 * 365, // Un año en segundos
    includeSubDomains: true,
    preload: true
}));
logger.info('Configuración de HSTS aplicada');

// Deshabilitar encabezado 'x-powered-by' para mayor seguridad
app.disable('x-powered-by');
logger.info('Encabezado x-powered-by deshabilitado');

// Middleware de análisis de cuerpo de la solicitud
app.use(bodyParser.json());
logger.info('Middleware bodyParser configurado para analizar JSON');

// Configuración de CORS
app.use(cors());
logger.info('Middleware CORS configurado');

// Configuración de rutas
routes(app);
logger.info('Rutas configuradas');

// Inicio del servidor
app.listen(port, () => {
    logger.info(`Servidor iniciado en http://localhost:${port}`);
});

module.exports = { app };

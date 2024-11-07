// src/app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const errorHandlerMiddleware = require('./middlewares/errorHandler.middleware');   // Gestiona y centraliza el manejo de errores
const LoggerUtils = require('./utils/logger.utils');
const { routes } = require('./routes/routes');
const config = require('./config/config');

// Obtener configuraciones
const { app: { port } } = config;

const app = express();
const logger = new LoggerUtils('app');

logger.info('Inicio configuración app.js');

// Configuración de seguridad con Helmet
app.use(helmet());
logger.info('Middleware Helmet configurado');

app.use(helmet.hsts({
    maxAge: 60 * 60 * 24 * 365, // Un año en segundos
    includeSubDomains: true,
    preload: true
}));

// Deshabilitar encabezado 'x-powered-by' para mayor seguridad
app.disable('x-powered-by');

// Middleware de análisis de cuerpo de la solicitud
app.use(bodyParser.json());

// Configuración de CORS
app.use(cors());

// Configuración de rutas
routes(app);
logger.info('Rutas configuradas');

app.use(errorHandlerMiddleware);

logger.info('Termino configuración app.js');

// Inicio del servidor
app.listen(port, () => {
    logger.info(`Servidor iniciado en http://localhost:${port}`);
});

module.exports = { app };

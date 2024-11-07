// src/utils/setHeadersMiddleware.js

const { initHeadersApplication } = require('../utils/headers.utils');

/**
 * Middleware para establecer encabezados personalizados en las solicitudes HTTP.
 * 
 * Este middleware agrega o modifica varios encabezados personalizados en cada solicitud antes de que sea procesada 
 * por los controladores de rutas, asegurando identificadores únicos y valores predeterminados para ciertos encabezados.
 * 
 * Encabezados personalizados agregados:
 * - `x-request-id`: Identificador único de la solicitud.
 * - `xtrackid`: Identificador de seguimiento.
 * - `codigosesion`: Código de sesión, con valor predeterminado vacío si no está presente.
 * - `terminalid`: Identificador del terminal, con valor predeterminado vacío si no está presente.
 * - `serialnumber`: Número de serie del dispositivo, con valor predeterminado vacío si no está presente.
 * - `rutPersonaEmpresa`: Identificador RUT del comercio o empresa, con valor predeterminado vacío si no está presente.
 * 
 * Encabezados fijos agregados:
 * - `nombreAplicacion`: Nombre de la aplicación.
 * - `codigoAplicacion`: Código de la aplicación.
 * - `canal`: Canal de ejecución de la aplicación.
 * - `funcionalidad`, `etapa`, `operacion`: Campos definidos por el usuario al llamar el middleware.
 * 
 * @param {string} funcionalidad - Nombre de la funcionalidad actual de la solicitud.
 * @param {string} etapa - Etapa de la solicitud en el flujo de la aplicación.
 * @param {string} operacion - Operación específica que está realizando la solicitud.
 * @returns {Function} Middleware que establece los encabezados personalizados en la solicitud.
 * 
 * @example
 * const express = require('express');
 * const setHeadersMiddleware = require('./setHeadersMiddleware');
 * 
 * const app = express();
 * 
 * // Aplicar el middleware a todas las rutas con valores de ejemplo
 * app.use(setHeadersMiddleware('Autenticación', 'Inicio', 'Login'));
 */
const setHeadersMiddleware = (funcionalidad, etapa, operacion) => (req, res, next) => {
    const { headers } = req;

    // Generar o modificar los encabezados personalizados usando la función auxiliar
    const initHeaders = initHeadersApplication(headers);

    // Sobrescribir los encabezados en la solicitud con los nuevos valores y encabezados adicionales
    req.headers = {
        ...initHeaders,
        nombreAplicacion: 'nombreAplicacion',
        codigoAplicacion: 'CODAPP',
        canal: 'Presencial',
        funcionalidad,
        etapa,
        operacion,
    };

    // Llamar al siguiente middleware
    next();
};

module.exports = setHeadersMiddleware;

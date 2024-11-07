const { monitoreo } = require("@bech/monitoreo");
const httpContext = require("@bech/express-http-context");

const config = require("../config/config");
const ETAPAS = config.etapas;

/**
 * Función que realiza el monitoreo de una operación HTTP.
 * 
 * Esta función registra las etapas y operaciones relacionadas con la solicitud HTTP, 
 * utilizando la información de respuesta proporcionada. También actualiza el contexto HTTP.
 * 
 * @param {string} codigoError - Código de respuesta que incluye información sobre la operación (e.g., 'CQR.GAS').
 * @param {object} [dataMonitoring=null] - Datos personalizados opcionales para el monitoreo (e.g., información adicional del contexto).
 * @example
 * const { monitoring } = require('./utils/monitoring.utils');
 * monitoring('CQR.GAS', { message: 'Consulta de sucursales exitosa' });
 */
function monitoring(codigoError, dataMonitoring = null) {
    const monitoringData = httpContext.get("monitoreo") || {}; // Obtener el contexto actual o inicializar

    try {
        // Validar que el código de respuesta esté presente
        if (codigoError) {
            // Extraer el código de etapa de la respuesta (e.g., 'GAS' de 'CQR.GAS')
            const etapa = codigoError.split('.')[1];

            // Si la etapa existe en el arreglo ETAPAS, se asignan las etapas y operaciones correctas
            if (ETAPAS[etapa]) {
                monitoringData['etapa'] = ETAPAS[etapa]['stage'];
                monitoringData['operacion'] = ETAPAS[etapa]['operation'];
            } else {
                // En caso de etapa desconocida, usar los valores por defecto
                monitoringData['etapa'] = ETAPAS['DEF']['stage'];
                monitoringData['operacion'] = ETAPAS['DEF']['operation'];
            }
        }
    } catch (error) {
        // Manejo de errores durante la extracción y asignación de etapas
        console.error('Error en la función de monitoring:', error);
        monitoringData['etapa'] = ETAPAS['DEF']['stage'];
        monitoringData['operacion'] = ETAPAS['DEF']['operation'];
    }

    // Actualizar el contexto HTTP con los datos de monitoreo
    httpContext.set("monitoreo", monitoringData);

    // Llamada final para registrar los datos de monitoreo
    monitoreo(codigoError, dataMonitoring);
}

module.exports = { monitoring };

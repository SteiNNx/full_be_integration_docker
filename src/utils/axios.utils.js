process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios').default;
const config = require('../config/config');
const { BusinessError, TechnicalError, ValidationError, AuthError, AdapterError } = require('..//exceptions/base.exceptions');

/**
 * @file Axios Client
 * @description Configuración personalizada para Axios con manejo de errores.
 * 
 * @table Errores Personalizados
 * | Código          | Descripción                                       |
 * |-----------------|---------------------------------------------------|
 * | CQR.CLI.001     | Error interno al manejar la solicitud              |
 * | CQR.CLI.002     | Error sin respuesta - ECONNABORTED                 |
 * | CQR.CLI.003     | Error sin respuesta - ECONNRESET                   |
 * | CQR.CLI.004     | Error sin respuesta - ${error.code || 'default'}   |
 * | CQR.CLI.005     | Error técnico                                     |
 * 
 */

/**
 * Crea una instancia de Axios con una configuración personalizada.
 * Configura el tiempo de espera (timeout) predeterminado de las solicitudes.
 * 
 * @type {AxiosInstance}
 */
const axiosInstance = axios.create({
    timeout: parseInt(config.axios.timeOut)
});

/**
 * Interceptor para las solicitudes HTTP.
 * Este interceptor se ejecuta antes de enviar una solicitud y permite
 * registrar detalles como la URL, método HTTP, encabezados, datos, y parámetros de la solicitud.
 * 
 * @param {object} config - La configuración de la solicitud actual.
 * @returns {object} - La configuración de la solicitud procesada.
 */
axiosInstance.interceptors.request.use((config) => {
    console.info({
        msg: 'AXIOS-API-CLIENT-REQUEST',
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
        params: config.params
    });
    return config;
}, (error) => {
    return Promise.reject(error); // Rechaza la promesa si ocurre un error al enviar la solicitud
});

/**
 * Interceptor para las respuestas HTTP.
 * Este interceptor maneja las respuestas de las solicitudes y captura errores de red o del servidor.
 * Dependiendo del código de error y los datos recibidos, lanza errores personalizados.
 * 
 * @param {object} response - La respuesta exitosa recibida del servidor.
 * @param {object} error - El objeto de error que contiene los detalles del fallo.
 * @returns {Promise<object>} - La respuesta exitosa o el error personalizado procesado.
 */
axiosInstance.interceptors.response.use((response) => {
    return response; // Devuelve la respuesta si es exitosa (códigos 2xx)
}, (error) => {
    return handleAxiosError(error); // Manejar el error
});

/**
 * Maneja los errores de Axios y lanza errores personalizados según el tipo de error recibido.
 * 
 * @param {object} error - El objeto de error recibido de Axios.
 * @returns {Promise<Error>} - El error personalizado lanzado.
 */
function handleAxiosError(error) {
    if (error.response) {
        return handleServerError(error);
    } else if (error.request) {
        // Si no se recibió respuesta del servidor (problema de red o tiempo de espera)
        console.warn({ msg: 'Error sin respuesta', error });
        console.warn({ msg: 'Error sin respuesta Headers', error: error.config.headers });

        const networkError = handleNetworkError(error);
        return Promise.reject(networkError);
    } else {
        // Si ocurrió un error en la configuración de la solicitud
        console.error({ msg: 'Error en la configuración de la solicitud', error });
        return Promise.reject(new TechnicalError('CQR.CLI.001', error.message || 'Error interno', error));
    }
}

/**
 * Maneja los errores recibidos del servidor, basándose en el tipo de error contenido en la respuesta.
 * 
 * @param {object} error - El objeto de error recibido de Axios.
 * @returns {Promise<Error>} - El error personalizado lanzado.
 */
function handleServerError(error) {
    const errorData = error.response.data;

    if (errorData?.name) {
        switch (errorData.name) {
            case 'BusinessError':
                return Promise.reject(new BusinessError(errorData.msg, errorData.code, errorData.statusCode));
            case 'TechnicalError':
                return Promise.reject(new TechnicalError(errorData.msg, errorData.code, errorData.statusCode));
            case 'ValidationError':
                return Promise.reject(new ValidationError(errorData.msg, errorData.code, errorData.statusCode, errorData.errors));
            case 'AuthError':
                return Promise.reject(new AuthError(errorData.msg, errorData.code, errorData.statusCode));
            case 'AdapterError':
                return Promise.reject(new AdapterError(errorData.msg, errorData.statusCode));
            default:
                return Promise.reject(new TechnicalError('CQR.CLI.005', error.message || 'Error sin mensaje', error));
        }
    } else {
        return Promise.reject(new TechnicalError('CQR.CLI.005', error.message || 'Error sin mensaje', error));
    }
}

/**
 * Maneja errores de red comunes (ECONNABORTED, ECONNRESET, etc.).
 * 
 * @param {object} error - El objeto de error recibido de Axios.
 * @returns {TechnicalError} - Una instancia de TechnicalError que representa el error de red.
 */
function handleNetworkError(error) {
    switch (error.code) {
        case 'ECONNABORTED':
            return new TechnicalError('CQR.CLI.002', 'Error sin respuesta - ECONNABORTED', error);
        case 'ECONNRESET':
            return new TechnicalError('CQR.CLI.003', 'Error sin respuesta - ECONNRESET', error);
        default:
            return new TechnicalError('CQR.CLI.004', `Error sin respuesta - ${error.code || 'default'}`, error);
    }
}

/**
 * Realiza una solicitud GET a un endpoint específico.
 * 
 * @async
 * @param {string} endpoint - La URL del endpoint al que se hará la solicitud.
 * @param {object} [headers={}] - Encabezados adicionales para la solicitud.
 * @param {object} [config={}] - Configuraciones adicionales para la solicitud.
 * @returns {Promise<object>} - La respuesta de los datos solicitados.
 */
async function get(endpoint, headers = {}, config = {}) {
    const response = await axiosInstance.get(endpoint, { headers, ...config, });
    return response.data;
}

/**
 * Realiza una solicitud POST a un endpoint específico con un cuerpo de datos.
 * 
 * @async
 * @param {string} endpoint - La URL del endpoint al que se hará la solicitud.
 * @param {object} body - Los datos a enviar en el cuerpo de la solicitud.
 * @param {object} [headers={}] - Encabezados adicionales para la solicitud.
 * @param {object} [config={}] - Configuraciones adicionales para la solicitud.
 * @returns {Promise<object>} - La respuesta de los datos enviados.
 */
async function post(endpoint, body, headers = {}, config = {}) {
    const response = await axiosInstance.post(endpoint, body, { headers, ...config, });
    return response.data;
}

/**
 * Realiza una solicitud PUT a un endpoint específico con un cuerpo de datos.
 * 
 * @async
 * @param {string} endpoint - La URL del endpoint al que se hará la solicitud.
 * @param {object} body - Los datos a enviar en el cuerpo de la solicitud.
 * @param {object} [headers={}] - Encabezados adicionales para la solicitud.
 * @param {object} [config={}] - Configuraciones adicionales para la solicitud.
 * @returns {Promise<object>} - La respuesta de los datos enviados.
 */
async function put(endpoint, body, headers = {}, config = {}) {
    const response = await axiosInstance.put(endpoint, body, { headers, ...config, });
    return response.data;
}

/**
 * Realiza una solicitud POST a un endpoint específico usando parámetros de consulta (query params).
 * 
 * @async
 * @param {string} endpoint - La URL del endpoint al que se hará la solicitud.
 * @param {object} queryParams - Parámetros de consulta que se enviarán con la solicitud.
 * @param {object} [config={}] - Configuraciones adicionales para la solicitud.
 * @returns {Promise<object>} - La respuesta de los datos enviados.
 */
async function postQueryParams(endpoint, queryParams, config = {}) {
    const response = await axiosInstance.post(endpoint, null, { params: queryParams, ...config, });
    return response.data;
}

// Exportar las funciones HTTP para uso externo
module.exports = {
    get,
    post,
    put,
    postQueryParams
};

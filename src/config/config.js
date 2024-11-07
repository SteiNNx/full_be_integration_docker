const fs = require('fs');
const path = require('path');

console.log(process.env);

/**
 * Función para cargar claves desde archivos, con verificación y manejo de errores.
 * 
 * @param {string} keyPath - Ruta relativa de la clave, desde la raíz del proyecto.
 * @param {string} keyType - Tipo de clave (privada o pública) para mostrar en mensajes de error.
 * @returns {string} - Contenido del archivo de clave.
 */
function loadKey(keyPath, keyType) {
    const resolvedPath = path.resolve(process.cwd(), keyPath);
    try {
        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`El archivo de la clave ${keyType} no existe en la ruta: ${resolvedPath}`);
        }
        return fs.readFileSync(resolvedPath, 'utf8');
    } catch (error) {
        console.error(`Error al cargar la clave ${keyType}: ${error.message}`);
        process.exit(1); // Termina el proceso si hay un error crítico en la carga de claves
    }
}

const config = {
    app: {
        debug: process.env.APP_DEBUG === 'true',
        env: process.env.APP_ENV || 'development',
        port: parseInt(process.env.APP_PORT, 10) || 3000,
        prefixUrl: '/ms/v1/commonjs',
    },
    axios: {
        timeOut: parseInt(process.env.AXIOS_CLIENT_TIMEOUT, 10) || 15000,
    },
    ms: {
        beAdSucursalesApiKey: process.env.BE_AD_SUCURSALES_APIKEY || 'smartposapk.f2a21ca4-5050-42fb-91ee-57658f50ea89',
        beAdSucursalesUrl: process.env.BE_AD_SUCURSALES_URL || 'https://api.sucursales.com',
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
        endpoint: process.env.AWS_DYNAMODB_ENDPOINT || 'http://localhost:8000',
    },
    dynamodb: {
        maxRetries: parseInt(process.env.DYNAMODB_MAX_RETRIES, 10) || 3,
        connectionTimeout: parseInt(process.env.DYNAMODB_CONNECTION_TIMEOUT, 10) || 10000,
        requestTimeout: parseInt(process.env.DYNAMODB_REQUEST_TIMEOUT, 10) || 5000,
        consistentRead: process.env.DYNAMODB_CONSISTENT_READ === 'true',
    },
    jwt: {
        secretType: process.env.JWT_SECRET_TYPE || 'RS256',
        privateKey: loadKey(process.env.JWT_PRIVATE_KEY_PATH, 'privada'),
        publicKey: loadKey(process.env.JWT_PUBLIC_KEY_PATH, 'pública'),
        expiration: process.env.JWT_EXPIRATION || '1h',
        expirationMs: parseInt(process.env.JWT_EXPIRATION_MS, 10) || 3600000,
    },
    monitoreo: {
        tipoPieza: 'ms',
        nombrePieza: 'be-xx-commonjs',
    },
    etapas: {
        GAS: { stage: 'Consulta Sucursales', operation: 'getSucursales' },
        GAD: { stage: 'Consulta Todos los Dates', operation: 'getAllDates' },
        GID: { stage: 'Consulta Date por ID', operation: 'getDateById' },
        ADD: { stage: 'Añadir Date', operation: 'addDate' },
        UPD: { stage: 'Actualizar Date', operation: 'updateDate' },
        DED: { stage: 'Eliminar Date', operation: 'deleteDate' },
        DEF: { stage: 'Etapa desconocida', operation: 'Operacion desconocida' }
    },
};

module.exports = config;

// src/utils/date.utils.js

const moment = require('moment-timezone');
const config = require('../config/config');

// Configurar la zona horaria por defecto a Santiago, Chile
const DEFAULT_TIMEZONE = config.app.timeZone;

/**
 * Obtiene la fecha y hora actual en la zona horaria de Santiago, Chile.
 * @returns {string} Fecha y hora en formato completo de Santiago de Chile
 * @example
 * const currentDate = getCurrentDateInSantiago();
 * console.log(currentDate); // "2024-11-06T15:23:45-03:00"
 */
function getCurrentDateInSantiago() {
    return moment().tz(DEFAULT_TIMEZONE).format();
}

/**
 * Obtiene la fecha y hora actual en formato UTC.
 * @returns {string} Fecha y hora en formato UTC
 * @example
 * const utcDate = getCurrentDateInUTC();
 * console.log(utcDate); // "2024-11-06T18:23:45Z"
 */
function getCurrentDateInUTC() {
    return moment().utc().format();
}

/**
 * Obtiene la fecha actual en formato corto (DD/MM/YYYY) para Santiago de Chile.
 * @returns {string} Fecha en formato corto (DD/MM/YYYY)
 * @example
 * const shortDate = getShortDateInSantiago();
 * console.log(shortDate); // "06/11/2024"
 */
function getShortDateInSantiago() {
    return moment().tz(DEFAULT_TIMEZONE).format('DD/MM/YYYY');
}

/**
 * Obtiene la fecha y hora en formato ISO para uso en logs o registros.
 * @returns {string} Fecha y hora en formato ISO de Santiago de Chile
 * @example
 * const isoDate = getISODateInSantiago();
 * console.log(isoDate); // "2024-11-06T15:23:45-03:00"
 */
function getISODateInSantiago() {
    return moment().tz(DEFAULT_TIMEZONE).toISOString();
}

/**
 * Obtiene la hora actual en formato corto (HH:mm:ss) para uso rápido en logs.
 * @returns {string} Hora en formato corto (HH:mm:ss)
 * @example
 * const shortTime = getCurrentTimeInSantiago();
 * console.log(shortTime); // "15:23:45"
 */
function getCurrentTimeInSantiago() {
    return moment().tz(DEFAULT_TIMEZONE).format('HH:mm:ss');
}

/**
 * Formatea una fecha específica en la zona horaria de Santiago de Chile, permitiendo elegir el formato.
 * @param {string|Date} date - Fecha a formatear (puede ser un string o un objeto Date)
 * @param {string} format - Formato de salida (por ejemplo, "DD/MM/YYYY HH:mm:ss")
 * @returns {string} Fecha formateada según el formato especificado
 * @example
 * const formattedDate = formatSpecificDateInSantiago(new Date(), "DD/MM/YYYY HH:mm:ss");
 * console.log(formattedDate); // "06/11/2024 15:23:45"
 */
function formatSpecificDateInSantiago(date = new Date(), format = 'DD/MM/YYYY HH:mm:ss') {
    return moment(date).tz(DEFAULT_TIMEZONE).format(format);
}

// Exportar funciones
module.exports = {
    getCurrentDateInSantiago,
    getCurrentDateInUTC,
    getShortDateInSantiago,
    getISODateInSantiago,
    getCurrentTimeInSantiago,
    formatSpecificDateInSantiago,
};

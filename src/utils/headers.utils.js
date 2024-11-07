const { formatSpecificDateInSantiago } = require('./date.utils');

/**
 * Genera y modifica los encabezados personalizados.
 * 
 * Esta función genera valores predeterminados para los encabezados si no están presentes,
 * como `x-request-id` y `xtrackid`, utilizando UUIDs para asegurar que las solicitudes tengan 
 * identificadores únicos. Además, se establecen valores predeterminados para otros encabezados.
 * 
 * @param {object} headers - Los encabezados originales de la solicitud.
 * @returns {object} Los encabezados modificados con los valores generados o existentes.
 */
function initHeadersApplication(headers) {
    const uuid = uuidv4();


    const xrequestid = headers['x-request-id'] || headers.xrequestid || headers.XrequestID || uuid;
    const xtrackid = headers.xtrackid || headers.XtrackID || headers.xTrackID || uuid;
    const codigosesion = headers.codigosesion || headers.codigoSesion || '';
    const terminalid = headers.terminalid || headers.terminalId || '';
    const rutPersonaEmpresa = headers.rutcomercio || headers.rutComercio || '';
    const rutcomercio = rutPersonaEmpresa;
    const serialnumber = headers.serialnumber || headers.serialNumber || '';

    // Retorna los encabezados originales modificados con nuevos valores
    return {
        ...headers,
        xtrackid,
        xrequestid,
        codigosesion,
        terminalid,
        rutPersonaEmpresa,
        rutcomercio,
        serialnumber,
    };
}

module.exports = {
    initHeadersApplication,
};

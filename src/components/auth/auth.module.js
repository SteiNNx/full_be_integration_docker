// src/components/auth/auth.module.js

const {
    getUserByUsernameService,
    saveUserService,
    updateAuthTokenService,
} = require('../../services/auth.service');

/**
 * Módulo para buscar un usuario por su nombre de usuario en DynamoDB.
 * 
 * @param {Object} req - Objeto de solicitud de Express que contiene `username` en `req.params`.
 * @returns {Promise<Object|null>} - Los datos del usuario o null si no existe.
 * @example
 * const user = await getUserByUsernameModule(req);
 */
async function getUserByUsernameModule(req) {
    try {
        const { username } = req.params;
        return await getUserByUsernameService(username);
    } catch (error) {
        console.error('Error en getUserByUsernameModule:', error);
        throw error;
    }
}

/**
 * Módulo para guardar un nuevo usuario en DynamoDB.
 * 
 * @param {Object} req - Objeto de solicitud de Express que contiene el usuario en `req.body`.
 * @returns {Promise<Object>} - Resultado de la operación de inserción.
 * @example
 * const result = await saveUserModule(req);
 */
async function saveUserModule(req) {
    try {
        const user = req.body;
        return await saveUserService(user);
    } catch (error) {
        console.error('Error en saveUserModule:', error);
        throw error;
    }
}

/**
 * Módulo para actualizar el token de autenticación y la fecha de expiración de un usuario.
 * 
 * @param {Object} req - Objeto de solicitud de Express que contiene `username`, `authToken`, y `expiresAt` en `req.body`.
 * @returns {Promise<Object>} - Resultado de la operación de actualización.
 * @example
 * const result = await updateAuthTokenModule(req);
 */
async function updateAuthTokenModule(req) {
    try {
        const { username, authToken, expiresAt } = req.body;
        return await updateAuthTokenService(username, authToken, expiresAt);
    } catch (error) {
        console.error('Error en updateAuthTokenModule:', error);
        throw error;
    }
}

module.exports = {
    getUserByUsernameModule,
    saveUserModule,
    updateAuthTokenModule,
};

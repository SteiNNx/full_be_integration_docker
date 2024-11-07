// src/services/auth.service.js

const AuthRepository = require('../db/repository/auth_tokens');

/**
 * Servicio para buscar un usuario por su nombre de usuario en DynamoDB.
 * 
 * @param {string} username - El nombre de usuario.
 * @returns {Promise<Object|null>} - Los datos del usuario o null si no existe.
 * @example
 * const user = await getUserByUsernameService('username123');
 */
async function getUserByUsernameService(username) {
    try {
        const authRepository = new AuthRepository();
        return await authRepository.getUserByUsername(username);
    } catch (error) {
        console.error('Error al obtener el usuario en getUserByUsernameService:', error);
        throw new Error('Error al obtener el usuario');
    }
}

/**
 * Servicio para guardar un nuevo usuario en DynamoDB.
 * 
 * @param {Object} user - Objeto con los datos del usuario.
 * @returns {Promise<Object>} - Resultado de la operación de inserción.
 * @example
 * const result = await saveUserService({ username: 'username123', authToken: 'token123' });
 */
async function saveUserService(user) {
    try {
        const authRepository = new AuthRepository();
        return await authRepository.saveUser(user);
    } catch (error) {
        console.error('Error al guardar el usuario en saveUserService:', error);
        throw new Error('Error al guardar el usuario');
    }
}

/**
 * Servicio para actualizar el token de autenticación y la fecha de expiración de un usuario en DynamoDB.
 * 
 * @param {string} username - El nombre de usuario.
 * @param {string} authToken - El token de autenticación.
 * @param {string} expiresAt - La fecha de expiración del token.
 * @returns {Promise<Object>} - Resultado de la operación de actualización.
 * @example
 * const result = await updateAuthTokenService('username123', 'newToken', '2024-12-31T23:59:59Z');
 */
async function updateAuthTokenService(username, authToken, expiresAt) {
    try {
        const authRepository = new AuthRepository();
        return await authRepository.updateAuthToken(username, authToken, expiresAt);
    } catch (error) {
        console.error('Error al actualizar el token en updateAuthTokenService:', error);
        throw new Error('Error al actualizar el token de autenticación');
    }
}

module.exports = {
    getUserByUsernameService,
    saveUserService,
    updateAuthTokenService,
};

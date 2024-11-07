// src/components/auth/auth.controller.js

const { OutputMessage } = require('../../schema/OutputMessage.schema');
const {
    getUserByUsernameModule,
    saveUserModule,
    updateAuthTokenModule,
} = require('./auth.module');

/**
 * Controlador para obtener un usuario por su nombre de usuario en DynamoDB.
 * 
 * @param {Object} req - Objeto de solicitud de Express, que contiene el parámetro `username`.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<Object>} - Respuesta JSON con código de estado y datos del usuario o un mensaje de error.
 * @example
 * router.get('/user/:username', getUserByUsernameController);
 */
const getUserByUsernameController = async (req, res) => {
    try {
        const responseGetUserByUsernameModule = await getUserByUsernameModule(req);
        const outputResponse = OutputMessage(200, "Ok", responseGetUserByUsernameModule);

        return res.status(200).json(outputResponse);
    } catch (error) {
        console.error('Error en getUserByUsernameController:', error);
        return res.status(500).json(OutputMessage(500, "Error al obtener el usuario"));
    }
};

/**
 * Controlador para guardar un nuevo usuario en DynamoDB.
 * 
 * @param {Object} req - Objeto de solicitud de Express, que contiene los datos del usuario en el cuerpo.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<Object>} - Respuesta JSON con código de estado y resultado de la operación o mensaje de error.
 * @example
 * router.post('/user', saveUserController);
 */
const saveUserController = async (req, res) => {
    try {
        const response = await saveUserModule(req);
        const outputResponse = OutputMessage(201, "Usuario creado exitosamente", response);

        return res.status(201).json(outputResponse);
    } catch (error) {
        console.error('Error en saveUserController:', error);
        return res.status(500).json(OutputMessage(500, "Error al guardar el usuario"));
    }
};

/**
 * Controlador para actualizar el token de autenticación y la fecha de expiración de un usuario.
 * 
 * @param {Object} req - Objeto de solicitud de Express, que contiene el `username`, `authToken`, y `expiresAt` en el cuerpo.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<Object>} - Respuesta JSON con código de estado y resultado de la operación o mensaje de error.
 * @example
 * router.put('/user/token', updateAuthTokenController);
 */
const updateAuthTokenController = async (req, res) => {
    try {
        const response = await updateAuthTokenModule(req);
        const outputResponse = OutputMessage(200, "Token de autenticación actualizado", response);

        return res.status(200).json(outputResponse);
    } catch (error) {
        console.error('Error en updateAuthTokenController:', error);
        return res.status(500).json(OutputMessage(500, "Error al actualizar el token de autenticación"));
    }
};

module.exports = {
    getUserByUsernameController,
    saveUserController,
    updateAuthTokenController,
};

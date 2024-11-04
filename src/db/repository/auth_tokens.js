const DynamoDBServiceClient = require('../client.dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

class AuthRepository {
    constructor() {
        this.dynamoDBService = new DynamoDBServiceClient();
    }

    /**
     * Busca un usuario en DynamoDB por su nombre de usuario.
     * 
     * @param {string} username - El nombre de usuario.
     * @returns {Promise<Object>} - Los datos del usuario o null si no existe.
     */
    async getUserByUsername(username) {
        const params = {
            TableName: 'auth_tokens',
            Key: marshall({ username })
        };
        const user = await this.dynamoDBService.getItem(params);
        return user && Object.keys(user).length ? user : null;
    }

    /**
     * Guarda un nuevo usuario en DynamoDB.
     * 
     * @param {Object} user - Objeto con los datos del usuario.
     * @returns {Promise<Object>} - Resultado de la operación de inserción.
     */
    async saveUser(user) {
        const params = {
            TableName: 'auth_tokens',
            Item: marshall(user)
        };
        return await this.dynamoDBService.addItem(params);
    }

    /**
     * Actualiza el token de autenticación y la fecha de expiración en DynamoDB.
     * 
     * @param {string} username - El nombre de usuario.
     * @param {string} authToken - El token de autenticación.
     * @param {string} expiresAt - La fecha de expiración del token.
     * @returns {Promise<Object>} - Resultado de la operación de actualización.
     */
    async updateAuthToken(username, authToken, expiresAt) {
        const params = {
            TableName: 'auth_tokens',
            Key: marshall({ username }),
            UpdateExpression: 'set auth_token = :authToken, expires_at = :expiresAt',
            ExpressionAttributeValues: marshall({
                ':authToken': authToken,
                ':expiresAt': expiresAt
            })
        };
        return await this.dynamoDBService.updateItem(params);
    }
}

module.exports = AuthRepository;

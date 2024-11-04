const {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    UpdateItemCommand,
    DeleteItemCommand,
    ScanCommand,
    QueryCommand
} = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const config = require('../config/config');

/**
 * Servicio para interactuar con DynamoDB.
 * Proporciona métodos para realizar operaciones como obtener, añadir, actualizar, eliminar, escanear y consultar ítems en DynamoDB.
 */
class DynamoDBServiceClient {

    /**
     * Constructor de DynamoDBServiceClient.
     * Inicializa el cliente de DynamoDB utilizando la configuración proporcionada.
     */
    constructor() {
        this.dynamoDBClient = new DynamoDBClient({
            region: config.aws.region,
            endpoint: config.aws.endpoint,
            credentials: {
                accessKeyId: config.aws.accessKeyId,
                secretAccessKey: config.aws.secretAccessKey,
            },
            maxRetries: config.dynamodb.maxRetries,
            requestTimeout: config.dynamodb.requestTimeout,
            connectionTimeout: config.dynamodb.connectionTimeout,
            readConsistency: config.dynamodb.consistentRead,
        });
    }

    /**
     * Obtiene un ítem de DynamoDB.
     * 
     * @param {Object} params - Los parámetros que incluyen la clave primaria para buscar el ítem.
     * @returns {Promise<Object>} - El ítem encontrado o un objeto vacío si no existe.
     * 
     * @example
     * const params = {
     *   TableName: 'MyTable',
     *   Key: marshall({ id: '123' })
     * };
     * const item = await dynamoDBService.getItem(params);
     * console.log(item); // { id: '123', name: 'John Doe' } o {}
     */
    async getItem(params) {
        const command = new GetItemCommand(params);
        const result = await this.dynamoDBClient.send(command);
        return result.Item ? unmarshall(result.Item) : {};
    }

    /**
     * Añade un nuevo ítem a DynamoDB.
     * 
     * @param {Object} params - Los parámetros que incluyen el ítem a agregar.
     * @returns {Promise<Object>} - Resultado de la operación de inserción, incluye un mensaje de éxito.
     * 
     * @example
     * const params = {
     *   TableName: 'MyTable',
     *   Item: marshall({ id: '124', name: 'Jane Doe' })
     * };
     * const result = await dynamoDBService.addItem(params);
     * console.log(result); // { success: true }
     */
    async addItem(params) {
        const command = new PutItemCommand(params);
        await this.dynamoDBClient.send(command);
        return { success: true };
    }

    /**
     * Actualiza un ítem en DynamoDB.
     * 
     * @param {Object} params - Los parámetros que incluyen las actualizaciones del ítem.
     * @returns {Promise<Object>} - Resultado de la operación de actualización, incluye un mensaje de éxito.
     * 
     * @example
     * const params = {
     *   TableName: 'MyTable',
     *   Key: marshall({ id: '124' }),
     *   UpdateExpression: 'set #name = :name',
     *   ExpressionAttributeNames: { '#name': 'name' },
     *   ExpressionAttributeValues: marshall({ ':name': 'Jane Smith' })
     * };
     * const result = await dynamoDBService.updateItem(params);
     * console.log(result); // { success: true }
     */
    async updateItem(params) {
        const command = new UpdateItemCommand(params);
        await this.dynamoDBClient.send(command);
        return { success: true };
    }

    /**
     * Elimina un ítem de DynamoDB.
     * 
     * @param {Object} params - Los parámetros que incluyen la clave primaria del ítem a eliminar.
     * @returns {Promise<Object>} - Resultado de la operación de eliminación, incluye un mensaje de éxito.
     * 
     * @example
     * const params = {
     *   TableName: 'MyTable',
     *   Key: marshall({ id: '124' })
     * };
     * const result = await dynamoDBService.deleteItem(params);
     * console.log(result); // { success: true }
     */
    async deleteItem(params) {
        const command = new DeleteItemCommand(params);
        await this.dynamoDBClient.send(command);
        return { success: true };
    }

    /**
     * Escanea una tabla en DynamoDB.
     * 
     * @param {Object} params - Los parámetros de escaneo.
     * @returns {Promise<Array<Object>>} - Lista de ítems escaneados o una lista vacía si no hay ítems.
     * 
     * @example
     * const params = {
     *   TableName: 'MyTable'
     * };
     * const result = await dynamoDBService.scanTable(params);
     * console.log(result); // [{ id: '123', name: 'John Doe' }, { id: '124', name: 'Jane Smith' }] o []
     */
    async scanTable(params) {
        const command = new ScanCommand(params);
        const result = await this.dynamoDBClient.send(command);
        return result.Items ? result.Items.map(item => unmarshall(item)) : [];
    }

    /**
     * Consulta una tabla en DynamoDB.
     * 
     * @param {Object} params - Los parámetros de consulta.
     * @returns {Promise<Array<Object>>} - Lista de ítems que coinciden con la consulta o una lista vacía si no hay coincidencias.
     * 
     * @example
     * const params = {
     *   TableName: 'MyTable',
     *   KeyConditionExpression: 'id = :id',
     *   ExpressionAttributeValues: marshall({ ':id': '123' })
     * };
     * const result = await dynamoDBService.queryTable(params);
     * console.log(result); // [{ id: '123', name: 'John Doe' }]
     */
    async queryTable(params) {
        const command = new QueryCommand(params);
        const result = await this.dynamoDBClient.send(command);
        return result.Items ? result.Items.map(item => unmarshall(item)) : [];
    }
}

module.exports = DynamoDBServiceClient;

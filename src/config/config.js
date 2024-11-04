const fs = require('fs');

const config = {
    app: {
        debug: process.env.APP_DEBUG === 'true',
        env: process.env.APP_ENV || 'development',
        port: parseInt(process.env.APP_PORT, 10) || 3000,
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
        privateKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY, 'utf8'),
        publicKey: fs.readFileSync(process.env.JWT_PUBLIC_KEY, 'utf8'),
        expiration: process.env.JWT_EXPIRATION || '1h',
        expirationMs: parseInt(process.env.JWT_EXPIRATION_MS, 10) || 3600000,
    }
};

module.exports = config;

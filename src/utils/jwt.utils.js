const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

class JwtUtils {
    /**
     * Genera un token JWT usando la clave privada y el algoritmo especificado en la configuración.
     * 
     * @param {Object} payload - Datos del usuario que se incluirán en el token (por ejemplo, `{ username: 'user123' }`).
     * @param {string} [private_key=config.jwt.privateKey] - Clave privada para firmar el token. Se utiliza la clave definida en la configuración si no se proporciona.
     * @param {string} [algorithm=config.jwt.secretType] - Algoritmo de firma del token, por defecto RS256 o el especificado en la configuración.
     * @param {string} [expiresIn=config.jwt.expiration] - Duración del token (por ejemplo, '1h' para una hora), basada en la configuración predeterminada.
     * @returns {string} - Token JWT firmado.
     * @example
     * const token = JwtUtils.generateToken({ username: 'user123' });
     * console.log(token); // Token JWT en formato string
     */
    static generateToken(
        payload,
        private_key = config.jwt.privateKey,
        algorithm = config.jwt.secretType,
        expiresIn = config.jwt.expiration,
    ) {
        return jwt.sign(
            payload,
            private_key,
            {
                algorithm: algorithm,
                expiresIn: expiresIn,
            }
        );
    }

    /**
     * Verifica un token JWT usando la clave pública y el algoritmo especificado.
     * 
     * @param {string} token - El token JWT a verificar.
     * @param {string} [public_key=config.jwt.publicKey] - Clave pública para verificar el token, por defecto se usa la configurada.
     * @param {string} [algorithm=config.jwt.secretType] - Algoritmo de verificación, por defecto el definido en la configuración.
     * @returns {Object} - Payload decodificado si el token es válido.
     * @throws {Error} - Lanza un error si el token es inválido o ha expirado.
     * @example
     * try {
     *   const payload = JwtUtils.verifyToken(token);
     *   console.log(payload); // Información contenida en el token
     * } catch (error) {
     *   console.error(error.message); // "Token is invalid or has expired"
     * }
     */
    static verifyToken(
        token,
        public_key = config.jwt.publicKey,
        algorithm = config.jwt.secretType,
    ) {
        try {
            return jwt.verify(
                token,
                public_key,
                {
                    algorithms: [
                        algorithm
                    ],
                }
            );
        } catch (error) {
            throw new Error('Token is invalid or has expired');
        }
    }

    /**
     * Encripta una contraseña en texto plano utilizando bcrypt.
     * 
     * @param {string} password - Contraseña en texto plano a encriptar.
     * @returns {Promise<string>} - Contraseña encriptada.
     * @example
     * const hashedPassword = await JwtUtils.hashPassword('mySecurePassword');
     * console.log(hashedPassword); // Cadena encriptada
     */
    static async hashPassword(password) {
        const saltRounds = config.jwt.saltRoundsHash;
        return await bcrypt.hash(password, saltRounds);
    }

    /**
     * Compara una contraseña en texto plano con un hash de bcrypt para verificar si coinciden.
     * 
     * @param {string} password - Contraseña en texto plano.
     * @param {string} hashedPassword - Contraseña previamente encriptada.
     * @returns {Promise<boolean>} - `true` si la contraseña coincide con el hash, `false` en caso contrario.
     * @example
     * const isValid = await JwtUtils.verifyPassword('mySecurePassword', hashedPassword);
     * console.log(isValid); // true o false
     */
    static async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = JwtUtils;

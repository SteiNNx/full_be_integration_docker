const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

class JwtUtils {
    /**
     * Genera un token JWT usando el algoritmo RS256 y la clave privada.
     * 
     * @param {Object} payload - Datos del usuario (e.g., { username }).
     * @returns {string} - Token JWT.
     */
    static generateToken(payload) {
        return jwt.sign(
            payload,
            config.jwt.privateKey,
            {
                algorithm: config.jwt.secretType,
                expiresIn: config.jwt.expiration,
            }
        );
    }

    /**
     * Verifica un token JWT usando la clave pública.
     * 
     * @param {string} token - El token JWT.
     * @returns {Object} - Payload decodificado.
     * @throws {Error} - Si el token es inválido o ha expirado.
     */
    static verifyToken(token) {
        try {
            return jwt.verify(
                token,
                config.jwt.publicKey,
                {
                    algorithms: [
                        config.jwt.secretType
                    ],
                }
            );
        } catch (error) {
            throw new Error('Token is invalid or has expired');
        }
    }

    /**
     * Encripta una contraseña usando bcrypt.
     * 
     * @param {string} password - Contraseña en texto plano.
     * @returns {Promise<string>} - Contraseña encriptada.
     */
    static async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    /**
     * Verifica si la contraseña coincide con el hash almacenado.
     * 
     * @param {string} password - Contraseña en texto plano.
     * @param {string} hashedPassword - Contraseña encriptada.
     * @returns {Promise<boolean>} - True si coincide, false en caso contrario.
     */
    static async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = JwtUtils;

// src/validations/auth.schema.js
const { z } = require('zod');

const getUserByUsernameSchemaRequest = z.object({
    params: z.object({
        username: z.string().min(1, "El nombre de usuario no puede estar vacío"),
    }),
});

const saveUserSchemaRequest = z.object({
    body: z.object({
        username: z.string().min(1, "El nombre de usuario es obligatorio"),
        email: z.string().email("Debe ser un correo electrónico válido"),
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    }),
});

const updateAuthTokenSchemaRequest = z.object({
    body: z.object({
        username: z.string().min(1, "El nombre de usuario es obligatorio"),
        authToken: z.string().min(1, "El token de autenticación no puede estar vacío")
    }),
});

module.exports = {
    getUserByUsernameSchemaRequest,
    saveUserSchemaRequest,
    updateAuthTokenSchemaRequest,
};

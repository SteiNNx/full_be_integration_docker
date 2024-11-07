'use strict';

class OutputMessage {
    constructor(code, message, datos) {
        this.statusCode = code;
        this.message = message;
        this.data = datos;
    }
}

module.exports = { OutputMessage };
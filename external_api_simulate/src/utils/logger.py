import logging

class CustomLogger:
    def __init__(self, name=__name__, level=logging.INFO):
        # Crear un logger
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)

        # Configurar el formato de los mensajes
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )

        # Crear y configurar un handler de consola si no existe
        if not self.logger.handlers:
            console_handler = logging.StreamHandler()
            console_handler.setLevel(level)
            console_handler.setFormatter(formatter)
            self.logger.addHandler(console_handler)

    def info(self, message):
        self.logger.info(message)

    def warning(self, message):
        self.logger.warning(message)

    def error(self, message):
        self.logger.error(message)

    def debug(self, message):
        self.logger.debug(message)

    def critical(self, message):
        self.logger.critical(message)

const fs = require('fs');
const path = require('path');
const winston = require('winston');

// Konfigurasi logger
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), 
                winston.format.simple()
            )
        }),
        // Transport untuk log ke file
        new winston.transports.File({
            filename: 'logs/app.log',
            level: 'debug'  
        }),
        // Transport untuk error log
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        })
    ]
});

module.exports = logger;

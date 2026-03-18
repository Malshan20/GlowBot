const { createLogger, format, transports } = require('winston');
const { combine, timestamp, colorize, printf, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] ${stack || message}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), errors({ stack: true }), logFormat),
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: combine(timestamp(), logFormat),
    }),
  ],
});

// Create logs directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('logs')) fs.mkdirSync('logs');

module.exports = logger;

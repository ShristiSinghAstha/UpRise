import winston from 'winston';
import fs from 'fs';
import path from 'path';

const logDir = 'logs';

// Create log directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }), // Include stack trace
  winston.format.json()
);

const transports = [
  // Write all logs with importance level of `error` or less to `error.log`
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
  // Write all logs with importance level of `info` or less to `combined.log`
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports,
});

// If in development mode, log to the console with colorized format
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `${info.timestamp} [${info.level}]: ${info.message}` + (info.stack ? `\n${info.stack}` : '')
        )
      ),
      level: 'debug',
    })
  );
}

// Create a stream object for Morgan middleware integration
const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

export { logger, morganStream };

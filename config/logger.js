import winston from 'winston';
import 'winston-mongodb';
const { createLogger, transports, format } = winston;

/**
 * Create the logger for info and error
 */
const logger = createLogger({
  transports: [
    new transports.File({
      filename: './logs/info.log',
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      level: 'error',
      filename: './logs/error.log',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

export default logger;

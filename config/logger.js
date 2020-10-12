import winston from 'winston';
import 'winston-mongodb';
const { createLogger, transports, format } = winston;

const logger = createLogger({
  transports: [
    new transports.File({
      filename: 'info.log',
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      level: 'error',
      filename: 'error.log',
      format: format.combine(format.timestamp(), format.json()),
    })
  ],
});

export default logger;

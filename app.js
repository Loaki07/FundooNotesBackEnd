import dotenv from 'dotenv';
import './config/dbEvents.js';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/routes.js';
import cookieParser from 'cookie-parser';
import logger from './config/logger.js';
import RedisCache from './middleware/redisCache.js';
import RabbitMQ from './msgQueue/rabbitMQ.js';

const { connectToRabbitMQ } = new RabbitMQ();
const { clearCache } = new RedisCache();

dotenv.config();
const app = express();

/**
 * Middlewares
 */
app.use((req, res, next) => {
  logger.info(req.body);
  let oldSend = res.send;
  res.send = function (data) {
    oldSend.apply(res, arguments);
  };
  next();
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', routes);

app.get('/', (req, res) => {
  res.status(200).send({
    success: true,
    message: 'Welcome to the Fundoo Notes Application',
  });
});

// Handler for Global Errors
app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }
  res.status(500).send({
    success: false,
    message: '500, Internal Server Error',
  });
});

// Handler for non-existence routes
app.use('*', (req, res) => {
  res.status(404).send({
    success: false,
    message: 'Page Does not exist',
  });
});

/**
 * Server
 */

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
  logger.info(`Listening on port ${process.env.PORT}...`);
  clearCache();
});

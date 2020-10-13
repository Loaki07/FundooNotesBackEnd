import dotenv from 'dotenv';
import connectDB from './config/dbConnection.js';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/routes.js';
import cookieParser from 'cookie-parser';
import logger from './config/logger.js';

dotenv.config();
connectDB();
const app = express();

/**
 * Middlewares
 */
app.use((req, res, next) => {
  logger.info(req.body);
  let oldSend = res.send;
  res.send =  (data) => {
    logger.info(data);
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

/**
 * Server
 */

// app.use('/*', 'Page Does not exist!');

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
  logger.log('error', `Listening on port ${process.env.PORT}...`);
});

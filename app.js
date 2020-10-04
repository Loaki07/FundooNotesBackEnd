import dotenv from 'dotenv';
import connectDB from './config/dbConnection.js';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/routes.js';

dotenv.config();
connectDB();
const app = express();

/**
 * Middlewares
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

/**
 * Server
 */
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});

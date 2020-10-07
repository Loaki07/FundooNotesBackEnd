import dotenv from 'dotenv';
import connectDB from './config/dbConnection.js';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();
const app = express();

/**
 * Middlewares
 */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', routes);

app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Fundoo Notes Application');
});

/**
 * Server
 */
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});

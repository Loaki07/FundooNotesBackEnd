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
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const { connectToRabbitMQ } = new RabbitMQ();
const { clearCache } = new RedisCache();

dotenv.config();
const app = express();
app.use(cors());

/**
 * Swagger
 */
let swaggerJson = JSON.parse(fs.readFileSync('./swagger.json').toString());
const oldswaggerOptions = {
  swaggerDefinition: {
    title: 'Fundoo App',
    description: 'To-do list note taking app',
    contact: {
      name: 'fundoo-app-dev',
    },
    servers: [process.env.PORT],
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
  // For Routes: "./routes/*.js"
  apis: ['./routes/*.js'],
};

const SwaggerOptions = {
  swaggerDefinition: swaggerJson,
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(SwaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', routes);
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   res.header('Access-Control-Allow-Methods', '*');
//   next();
// });

/**
 * @swagger
 * /:
 *  get:
 *    description: Fundoo-Application Homepage
 *    responses:
 *      '200':
 *        description: A successful response
 */
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

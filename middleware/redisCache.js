import redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();
import { ErrorResponse } from '../utility/errorResponse.js';
import logger from '../config/logger.js';

const REDIS_PORT = 6379;
const client = redis.createClient(REDIS_PORT);

class RedisCache {
  getDataFromCache = (req, res, next) => {
    const responseData = {};

    client.get(`User:${req.user._id}`, (err, data) => {
      if (err) {
        responseData.success = false;
        responseData.message = error.message;
        logger.error(error.message);
        res.status(error.statusCode || 500).send(responseData);
      }
      let parsedData = JSON.parse(data);
      if (data !== null && parsedData.length !== 0) {
        responseData.success = true;
        responseData.message = 'User Notes from Cache';
        responseData.data = parsedData;
        logger.info(responseData.message);
        res.status(200).send(responseData);
      } else {
        next();
      }
    });
  };

  setDataintoCache = (userId, data) => {
    client.set(`User:${userId}`, JSON.stringify(data));
  };
}

export default RedisCache;

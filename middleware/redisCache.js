import redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();
import { ErrorResponse } from '../utility/errorResponse.js';
import logger from '../config/logger.js';

const REDIS_PORT = 6379;
const client = redis.createClient(REDIS_PORT);

class RedisCache {
  /**
   * @description Middleware function to get data stored from cache
   * @param {Object} req 
   * @param {Object} res 
   * @param {Function} next 
   */
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

  /**
   * @description Set key: value, data into redis cache
   * @param {ObjectId} userId 
   * @param {Object} data 
   */
  setDataintoCache = (userId, data) => {
    client.set(`User:${userId}`, JSON.stringify(data));
  };

  /**
   * @description Function to clear the redis cache
   */
  clearCache = () => {
    console.log(`Redis Cache cleared and is ready for use...`);
    logger.info(`Redis Cache cleared and is ready for use...`);
    client.flushall();
  };
}

export default RedisCache;

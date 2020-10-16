import redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const REDIS_PORT = process.env.PORT || 6379;
const redisClient = redis.createClient(REDIS_PORT);

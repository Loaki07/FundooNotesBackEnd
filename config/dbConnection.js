import dotenv from 'dotenv';
import mongoose, { mongo } from 'mongoose';
import logger from './logger.js';
dotenv.config();

/**
 * Connection to MongoDB
 */
const connectDB = async () => {
  mongoose.set('useCreateIndex', true);

  mongoose.connection.on('connected', () => {
    logger.info('Connected to MongoDB!');
    console.log('Connected to MongoDB!');
  });

  mongoose.connection.on('disconnected', () => {
    logger.info('MongoDB Connection disconnected!');
    console.log('MongoDB Connection disconnected!');
  });

  mongoose.connection.on('error', () => {
    logger.info('Error in connection!');
    console.log('Error in connection!');
    process.exit();
  });

  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDB;

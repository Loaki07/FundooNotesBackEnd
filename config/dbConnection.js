import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from './logger.js';
dotenv.config();

/**
 * Connection to MongoDB
 */
const connectDB = async () => {
  try {
    mongoose.set('useCreateIndex', true);

    mongoose.connection.on('connected', () => {
      logger.info('Connected to MongoDB!');
      console.log('Connected to MongoDB!');
    });

    mongoose.connection.on('disconnected', () => {
      logger.info('MongoDB Connection disconnected!');
      console.log('MongoDB Connection disconnected!');
    });

    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    logger.error('Could not Connect to MongoDB...', error);
    console.log('Could not Connect to MongoDB...', error);
    process.exit();
  }
};

export default connectDB;

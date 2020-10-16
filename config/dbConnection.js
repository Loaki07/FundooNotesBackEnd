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
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Connected to MongoDB!');
    console.log('Connected to MongoDB!');
  } catch (error) {
    logger.error('Could not Connect to MongoDB...', error);
    console.log('Could not Connect to MongoDB...', error);
    process.exit();
  }
};

export default connectDB;

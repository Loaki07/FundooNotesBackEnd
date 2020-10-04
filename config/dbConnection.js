import dotenv from 'dotenv';
import mongoose from 'mongoose';
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
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Could not Connect to MongoDB...', error);
    process.exit();
  }
};

export default connectDB;

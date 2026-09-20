import mongoose from 'mongoose';
import { config } from './index';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL || config.mongodbUri;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables!');
    throw new Error('MONGODB_URI is missing in environment variables');
  }

  try {
    await mongoose.connect(uri, {
      bufferCommands: true,
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log('🍃 Database: Connected to MongoDB Atlas Cloud');
  } catch (error) {
    isConnected = false;
    console.error('MongoDB connection error:', error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

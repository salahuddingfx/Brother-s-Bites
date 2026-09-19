import mongoose from 'mongoose';
import { config } from './index';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

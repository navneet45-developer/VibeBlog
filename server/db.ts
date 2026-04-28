import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

export const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      console.warn('MONGODB_URI is not defined in environment variables. Database operations will fail.');
      return;
    }
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err instanceof Error ? err.message : err);
    // Don't exit process in this environment, just log
  }
};

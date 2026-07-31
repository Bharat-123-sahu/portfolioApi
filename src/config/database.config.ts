import mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
import { getRequiredEnv } from './env.config';

const logger = new Logger('Database');

export async function connectToMongoDB(): Promise<void> {
  try {
    const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_HOST } = process.env;
    const MONGODB_DATABASE = getRequiredEnv('MONGODB_DATABASE');

    let databaseURI =
      process.env.MONGODB_URI ||
      `mongodb://127.0.0.1:27017/${MONGODB_DATABASE}`;

    if (MONGODB_USERNAME && MONGODB_PASSWORD && MONGODB_HOST) {
      databaseURI =
        `mongodb+srv://${encodeURIComponent(MONGODB_USERNAME)}:${encodeURIComponent(MONGODB_PASSWORD)}` +
        `@${MONGODB_HOST}/${MONGODB_DATABASE}` +
        `?retryWrites=true&w=majority`;
    }

    await mongoose.connect(databaseURI);

    logger.log('MongoDB connected.');
  } catch (error) {
    logger.error('MongoDB connection failed.', error);
    process.exit(1);
  }
}

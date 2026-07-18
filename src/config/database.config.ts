import { config } from 'dotenv';
import mongoose from 'mongoose';

config();

export async function connectToMongoDB(): Promise<void> {
  try {
    const {
      MONGODB_USERNAME,
      MONGODB_PASSWORD,
      MONGODB_HOST,
      MONGODB_DATABASE,
    } = process.env;

    let databaseURI = `mongodb://127.0.0.1:27017/${MONGODB_DATABASE}`;

    if (MONGODB_USERNAME && MONGODB_PASSWORD && MONGODB_HOST) {
      databaseURI =
        `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}` +
        `@${MONGODB_HOST}/${MONGODB_DATABASE}` +
        `?retryWrites=true&w=majority`;
    }

    await mongoose.connect(databaseURI);

    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

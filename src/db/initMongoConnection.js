import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export async function initMongoConnection() {
  try {
    const MONGODB_USER = getEnvVar('MONGODB_USER');
    const MONGODB_PASSWORD = getEnvVar('MONGODB_PASSWORD');
    const MONGODB_URL = getEnvVar('MONGODB_URL');
    const MONGODB_DB = getEnvVar('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log('Error while setting up mongo connection', error);
    throw error;
  }
}

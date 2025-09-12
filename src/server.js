import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';

// import { getEnvVar } from './utils/getEnvVar.js';

// const PORT = Number(getEnvVar('PORT', '3000'));

dotenv.config();

const PORT = 8080;

export async function setupServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => res.json({ message: '' }));

  app.use('*', (req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port ${PORT}`);
  });
}

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import cookieParser from 'cookie-parser';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export async function setupServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.set('json spaces', 2);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import {
  getContactsController,
  getContactByIdController,
} from './controllers/contacts.js';

const PORT = process.env.PORT || 3000;

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

  app.set('json spaces', 2);

  app.get('/contacts', getContactsController);
  app.get('/contacts/:contactId', getContactByIdController);

  app.use(/.*/, (req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port ${PORT}`);
  });
}

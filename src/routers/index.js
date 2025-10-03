import express from 'express';
import authRoutes from './auth.js';
import contactRouters from './contacts.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/contacts', authenticate, contactRouters);

export default router;

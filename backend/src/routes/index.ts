import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import appRoutes from './appRoutes';
import secretRoutes from './secretRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/apps', appRoutes);
router.use('/apps', secretRoutes);

export default router;

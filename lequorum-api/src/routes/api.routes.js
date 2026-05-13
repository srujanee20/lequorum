import { Router } from 'express';
import authRoutes from './auth.routes.js';
import pollRoutes from './poll.routes.js';
import responseRoutes from './response.routes.js';
import analyticsRoutes from './analytics.routes.js';
import logRoutes from './log.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/polls', pollRoutes);
router.use('/polls', responseRoutes);
router.use('/polls', analyticsRoutes);
router.use('/logs', logRoutes);

export default router;

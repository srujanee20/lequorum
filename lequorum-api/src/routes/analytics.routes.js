import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller.js';
import { requireAuth } from '../middlewares/authentication.middleware.js';

const router = Router();

router.get('/:id/analytics', requireAuth, getAnalytics);

export default router;

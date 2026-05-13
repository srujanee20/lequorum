import { Router } from 'express';
import { logEvent } from '../controllers/log.controller.js';

const router = Router();

router.post('/', logEvent);

export default router;

import { Router } from 'express';
import { submitResponse } from '../controllers/response.controller.js';
import { passthroughAuth } from '../middlewares/passthrough.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { respondSchema } from '../validators/response.validator.js';

const router = Router();

router.post('/:id/respond', passthroughAuth, validate(respondSchema), submitResponse);

export default router;

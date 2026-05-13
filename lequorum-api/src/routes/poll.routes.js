import { Router } from 'express';
import { getMyPolls, getPollById, createPoll, publishPoll, deletePoll } from '../controllers/poll.controller.js';
import { requireAuth } from '../middlewares/authentication.middleware.js';
import { passthroughAuth } from '../middlewares/passthrough.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { pollSchema } from '../validators/poll.validator.js';

const router = Router();

router.route('/')
    .get(requireAuth, getMyPolls)
    .post(requireAuth, validate(pollSchema), createPoll);

router.route('/:id')
    .get(passthroughAuth, getPollById)
    .delete(requireAuth, deletePoll);

router.patch('/:id/publish', requireAuth, publishPoll);

export default router;

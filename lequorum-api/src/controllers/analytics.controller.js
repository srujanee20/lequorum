import { buildAnalytics } from '../services/analytics.service.js';
import { Poll } from '../models/init.js';
import { logger } from '../configs/logger.config.js';

export const getAnalytics = async (req, res) => {
    try {
        const pollId = req.params.id;
        const poll = await Poll.findOne({ where: { id: pollId, creatorId: req.user.id } });

        if (!poll) {
            logger.warn({ pollId, userId: req.user.id }, 'Analytics fetch failed: Poll not found or not owned');
            return res.status(404).json({ error: 'Poll not found' });
        }

        logger.debug({ pollId }, 'Building analytics for poll');
        const analytics = await buildAnalytics(pollId);

        logger.debug({ pollId, responseCount: analytics.totalResponses }, 'Analytics built successfully');
        res.json(analytics);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

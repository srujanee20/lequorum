import { logger } from '../configs/logger.config.js';

export const logEvent = (req, res) => {
    try {
        const { level, message, stack } = req.body;
        const logFn = logger[level] || logger.info;
        logFn({ stack }, `[FRONTEND] ${message}`);
        res.status(204).end();
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

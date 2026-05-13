import { verifyToken } from '../services/authentication.service.js';

export const requireAuth = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer '))
        return res.status(401).json({ error: 'No token provided' });

    try {
        req.user = verifyToken(header.split(' ')[1]);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

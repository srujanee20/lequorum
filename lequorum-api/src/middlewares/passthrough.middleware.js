import { verifyToken } from '../services/authentication.service.js';

export const passthroughAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
        try {
            req.user = verifyToken(header.split(' ')[1]);
        } catch {
            // invalid token — stay anonymous
        }
    }
    next();
};

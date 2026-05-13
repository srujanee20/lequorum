import bcrypt from 'bcryptjs';

import { User } from '../models/init.js';
import { generateToken } from '../services/authentication.service.js';
import { logger } from '../configs/logger.config.js';

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const exists = await User.findOne({ where: { username } });
        if (exists) {
            logger.warn({ username }, 'Registration failed: Username already taken');
            return res.status(409).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

        const token = generateToken({ id: user.id, username: user.username });

        logger.info({ userId: user.id, username: user.username }, 'User registered successfully');
        res.status(201).json({ token, user: { id: user.id, username: user.username } });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            logger.warn({ username }, 'Login failed: Invalid username');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            logger.warn({ username }, 'Login failed: Invalid password');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({ id: user.id, username: user.username });

        logger.info({ userId: user.id, username: user.username }, 'User logged in successfully');
        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

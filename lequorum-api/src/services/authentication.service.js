import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET;
const ISSUER = process.env.JWT_ISSUER;
const AUDIENCE = process.env.JWT_AUDIENCE;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const generateToken = payload => jwt.sign(payload, SECRET, {
    expiresIn: EXPIRES_IN,
    issuer: ISSUER,
    audience: AUDIENCE,
    subject: String(payload.id),
    jwtid: crypto.randomUUID()
});

export const verifyToken = token => jwt.verify(token, SECRET, {
    issuer: ISSUER,
    audience: AUDIENCE
});

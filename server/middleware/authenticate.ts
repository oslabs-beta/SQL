import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const secretKey = process.env.JWT_SECRET;

export default function authenticate (req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Failed to authenicate token' });
            }
            req.userId = decoded.userId;
            next();
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
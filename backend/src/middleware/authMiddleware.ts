import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const user = await AuthService.verifyToken(token);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        // Attach user to request object
        (req as any).user = user;
        next();
    } catch (error: any) {
        res.status(401).json({ error: 'Unauthorized: Authentication failed' });
    }
};

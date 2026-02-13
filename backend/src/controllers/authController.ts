import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';

export class AuthController {
    /**
     * Firebase Sync - Main auth endpoint for Firebase-authenticated users.
     * Creates or finds the user in the database based on Firebase credentials.
     */
    static async firebaseSync(req: Request, res: Response) {
        try {
            const { firebaseUid, email, name, source } = req.body;

            if (!firebaseUid || !email) {
                return res.status(400).json({ error: 'Firebase UID and email are required' });
            }

            // Optionally verify the Firebase token from the Authorization header
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                const decoded = await AuthService.verifyFirebaseToken(token);
                if (!decoded) {
                    return res.status(401).json({ error: 'Invalid Firebase token' });
                }
            }

            const result = await AuthService.firebaseSync(firebaseUid, email, name, source);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Legacy endpoints kept for backward compatibility
    static async register(req: Request, res: Response) {
        try {
            const { email, password, name, marketingOptIn } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const result = await AuthService.register(email, password, name, marketingOptIn);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const result = await AuthService.login(email, password);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    static async me(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];
            const user = await AuthService.verifyToken(token);

            if (!user) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            const profile = await AuthService.getUserProfile(user.id);
            res.json(profile);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async googleLogin(req: Request, res: Response) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ error: 'Google Token is required' });
            }

            const result = await AuthService.googleAuth(token);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

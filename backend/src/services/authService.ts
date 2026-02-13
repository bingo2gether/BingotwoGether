import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { User } from '@prisma/client';
import { CoupleService } from './coupleService.js';
import admin from 'firebase-admin';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Initialize Firebase Admin SDK (for token verification)
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'bingo2gether-f2631',
    });
}

export class AuthService {
    /**
     * Sync a Firebase-authenticated user with the backend database.
     * Creates the user if they don't exist, or returns the existing one.
     */
    static async firebaseSync(firebaseUid: string, email: string, name?: string, source: string = 'email') {
        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // Update Firebase UID if not set
            if (!user.googleId && source === 'google') {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId: firebaseUid, source: user.source || source }
                });
            }
        } else {
            // Create new user from Firebase auth
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || null,
                    googleId: firebaseUid,
                    source,
                    marketingOptIn: true,
                }
            });
        }

        return this.buildUserProfile(user);
    }

    /**
     * Verify a Firebase ID token and return the decoded payload.
     */
    static async verifyFirebaseToken(idToken: string) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            return decodedToken;
        } catch (error) {
            console.error('Firebase token verification failed:', error);
            return null;
        }
    }

    /**
     * Verify token - tries Firebase first, then falls back to legacy JWT
     */
    static async verifyToken(token: string) {
        // Try Firebase token first
        const firebaseDecoded = await this.verifyFirebaseToken(token);
        if (firebaseDecoded) {
            // Find or create user by Firebase UID/email
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { googleId: firebaseDecoded.uid },
                        { email: firebaseDecoded.email }
                    ]
                }
            });
            return user;
        }

        // Fallback: try legacy JWT
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const user = await prisma.user.findUnique({ where: { id: decoded.id } });
            return user;
        } catch {
            return null;
        }
    }

    // Keep legacy methods for backward compatibility
    static async register(email: string, password: string, name?: string, marketingOptIn: boolean = true) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name: name || null,
                source: 'email',
                marketingOptIn,
            },
        });

        return this.generateTokenWithPlan(user);
    }

    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        return this.generateTokenWithPlan(user);
    }

    static async googleAuth(token: string) {
        // This is now handled by Firebase on the frontend
        // Keeping for backward compatibility
        throw new Error('Use Firebase Auth for Google login');
    }

    /**
     * Build user profile with plan info (shared helper)
     */
    static async buildUserProfile(user: User) {
        let planInfo = { planType: 'free', isPro: false, planExpiresAt: null as string | null };

        if (user.coupleId) {
            try {
                const status = await CoupleService.getPlanStatus(user.coupleId);
                planInfo = {
                    planType: status.planType,
                    isPro: status.isPro,
                    planExpiresAt: status.planExpiresAt ? status.planExpiresAt.toISOString() : null,
                };
            } catch {
                // Fallback to free if couple lookup fails
            }
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                coupleId: user.coupleId,
                isPro: planInfo.isPro,
                planType: planInfo.planType,
                planExpiresAt: planInfo.planExpiresAt,
            },
        };
    }

    static async generateTokenWithPlan(user: User) {
        const profile = await this.buildUserProfile(user);

        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        return { token, ...profile };
    }

    static generateToken(user: User) {
        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                coupleId: user.coupleId,
                isPro: false,
            },
        };
    }

    static async getUserProfile(userId: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        const profile = await this.buildUserProfile(user);
        return profile.user;
    }
}

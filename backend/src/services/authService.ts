import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { User } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { CoupleService } from './coupleService.js';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export class AuthService {
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
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error('Invalid Google Token');
        }

        const { email, name, sub: googleId } = payload;

        if (!email) {
            throw new Error('Email not provided in Google Token');
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            if (!user.googleId && googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId, source: user.source || 'google' }
                });
            }
        } else {
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || 'Usuário Google',
                    googleId,
                    source: 'google',
                    marketingOptIn: true, // OAuth users are usually opted in by default in this flow
                }
            });
        }

        return this.generateTokenWithPlan(user);
    }

    /**
     * Generate JWT token + user profile with couple/plan info.
     */
    static async generateTokenWithPlan(user: User) {
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

        const payload = {
            id: user.id,
            email: user.email,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        return {
            token,
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

    /**
     * Legacy generateToken for backward compat
     */
    static generateToken(user: User) {
        const payload = {
            id: user.id,
            email: user.email,
        };

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

    static async verifyToken(token: string) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const user = await prisma.user.findUnique({ where: { id: decoded.id } });
            return user;
        } catch {
            return null;
        }
    }

    /**
     * Get current user profile with plan info (for /me endpoint).
     */
    static async getUserProfile(userId: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

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
                // Fallback
            }
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            coupleId: user.coupleId,
            isPro: planInfo.isPro,
            planType: planInfo.planType,
            planExpiresAt: planInfo.planExpiresAt,
        };
    }
}

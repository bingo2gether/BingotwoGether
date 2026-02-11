import prisma from '../prisma.js';
import crypto from 'crypto';

export class CoupleService {
    /**
     * Create a couple — the current user becomes the OWNER.
     * Also auto-creates if they don't have a couple yet.
     */
    static async createCouple(userId: string) {
        // Check if user already has a couple
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');
        if (user.coupleId) throw new Error('Você já faz parte de uma conta compartilhada');

        const couple = await prisma.couple.create({
            data: {
                ownerUserId: userId,
            },
        });

        // Link user to couple as owner
        await prisma.user.update({
            where: { id: userId },
            data: {
                coupleId: couple.id,
                role: 'owner',
            },
        });

        return couple;
    }

    /**
     * Get couple info by user's coupleId
     */
    static async getCoupleByUser(userId: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.coupleId) return null;

        const couple = await prisma.couple.findUnique({
            where: { id: user.coupleId },
            include: {
                users: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                    },
                },
                invites: {
                    where: { status: 'pending' },
                    select: {
                        id: true,
                        email: true,
                        status: true,
                        expiresAt: true,
                    },
                },
            },
        });

        return couple;
    }

    /**
     * Owner invites a partner via email.
     * Max 1 partner. Token expires in 48h.
     */
    static async invitePartner(userId: string, partnerEmail: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        // Must be owner
        if (user.role !== 'owner') {
            throw new Error('Apenas o dono da conta pode convidar um parceiro');
        }

        if (!user.coupleId) throw new Error('Você precisa criar uma conta primeiro');

        const couple = await prisma.couple.findUnique({ where: { id: user.coupleId } });
        if (!couple) throw new Error('Conta não encontrada');

        // Check if partner slot is already taken
        if (couple.partnerUserId) {
            throw new Error('Sua conta já possui um parceiro. O limite é de 2 pessoas por conta.');
        }

        // Check for existing pending invite
        const existingInvite = await prisma.invite.findFirst({
            where: {
                coupleId: couple.id,
                status: 'pending',
                expiresAt: { gt: new Date() },
            },
        });

        if (existingInvite) {
            throw new Error('Já existe um convite pendente. Aguarde a expiração ou peça ao parceiro para aceitar.');
        }

        // Can't invite yourself
        if (partnerEmail === user.email) {
            throw new Error('Você não pode convidar a si mesmo');
        }

        // Create invite with 48h expiry
        const invite = await prisma.invite.create({
            data: {
                coupleId: couple.id,
                email: partnerEmail,
                token: crypto.randomUUID(),
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
            },
        });

        return invite;
    }

    /**
     * Accept an invite — the user becomes PARTNER of the couple.
     */
    static async acceptInvite(userId: string, token: string) {
        const invite = await prisma.invite.findUnique({ where: { token } });
        if (!invite) throw new Error('Convite não encontrado');

        if (invite.status !== 'pending') {
            throw new Error('Este convite já foi utilizado');
        }

        if (invite.expiresAt < new Date()) {
            await prisma.invite.update({
                where: { id: invite.id },
                data: { status: 'expired' },
            });
            throw new Error('Este convite expirou. Peça um novo convite ao dono da conta.');
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        // Verify email matches
        if (user.email !== invite.email) {
            throw new Error('Este convite foi enviado para outro e-mail');
        }

        // Check if user is already in a couple
        if (user.coupleId) {
            throw new Error('Você já faz parte de outra conta compartilhada');
        }

        const couple = await prisma.couple.findUnique({ where: { id: invite.coupleId } });
        if (!couple) throw new Error('Conta não encontrada');

        if (couple.partnerUserId) {
            throw new Error('Esta conta já possui um parceiro');
        }

        // Transaction: accept invite + link user + update couple
        await prisma.$transaction([
            prisma.invite.update({
                where: { id: invite.id },
                data: { status: 'accepted' },
            }),
            prisma.user.update({
                where: { id: userId },
                data: {
                    coupleId: couple.id,
                    role: 'partner',
                },
            }),
            prisma.couple.update({
                where: { id: couple.id },
                data: { partnerUserId: userId },
            }),
        ]);

        return { coupleId: couple.id, role: 'partner' };
    }

    /**
     * Get plan status for a couple.
     * Returns whether the plan is active and details.
     */
    static async getPlanStatus(coupleId: string) {
        const couple = await prisma.couple.findUnique({ where: { id: coupleId } });
        if (!couple) throw new Error('Conta não encontrada');

        const isActive = CoupleService.isPlanActive(couple.planType, couple.planExpiresAt);

        return {
            planType: couple.planType,
            planExpiresAt: couple.planExpiresAt,
            isActive,
            isPro: couple.planType !== 'free' && isActive,
        };
    }

    /**
     * Check if a plan is currently active.
     */
    static isPlanActive(planType: string, planExpiresAt: Date | null): boolean {
        if (planType === 'free') return true; // Free is always "active" (but not PRO)
        if (planType === 'vitalicio') return true; // Lifetime never expires
        if (!planExpiresAt) return false;
        return planExpiresAt > new Date();
    }

    /**
     * Upgrade a couple's plan after successful payment.
     */
    static async upgradePlan(coupleId: string, planType: string) {
        let planExpiresAt: Date | null = null;

        switch (planType) {
            case 'mensal':
                planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                break;
            case 'anual':
                planExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
                break;
            case 'vitalicio':
                planExpiresAt = null;
                break;
            default:
                throw new Error(`Invalid plan type: ${planType}`);
        }

        return prisma.couple.update({
            where: { id: coupleId },
            data: {
                planType,
                planExpiresAt,
            },
        });
    }

    /**
     * Ensure user has a couple (auto-create if needed).
     * Used during payment flow when user may not have created a couple yet.
     */
    static async ensureCouple(userId: string): Promise<string> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        if (user.coupleId) return user.coupleId;

        const couple = await this.createCouple(userId);
        return couple.id;
    }
}

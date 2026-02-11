import { Request, Response } from 'express';
import { CoupleService } from '../services/coupleService.js';

export class CoupleController {
    /**
     * GET /api/couple — Get user's couple info
     */
    static async getCouple(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const couple = await CoupleService.getCoupleByUser(user.id);
            if (!couple) {
                return res.json({ couple: null, message: 'Nenhuma conta compartilhada ativa' });
            }

            const planStatus = await CoupleService.getPlanStatus(couple.id);

            res.json({
                couple: {
                    id: couple.id,
                    ownerUserId: couple.ownerUserId,
                    partnerUserId: couple.partnerUserId,
                    members: couple.users,
                    pendingInvites: couple.invites,
                    plan: planStatus,
                    createdAt: couple.createdAt,
                },
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * POST /api/couple/create — Create a couple (user becomes owner)
     */
    static async createCouple(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const couple = await CoupleService.createCouple(user.id);
            res.status(201).json({ couple });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * POST /api/couple/invite — Owner invites partner by email
     */
    static async invitePartner(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { email } = req.body;
            if (!email) return res.status(400).json({ error: 'Email é obrigatório' });

            const invite = await CoupleService.invitePartner(user.id, email);
            res.status(201).json({
                invite: {
                    id: invite.id,
                    email: invite.email,
                    token: invite.token,
                    expiresAt: invite.expiresAt,
                },
                message: `Convite enviado para ${email}. O link expira em 48 horas.`,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * POST /api/couple/accept/:token — Accept an invite
     */
    static async acceptInvite(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { token } = req.params;
            if (!token) return res.status(400).json({ error: 'Token é obrigatório' });

            const result = await CoupleService.acceptInvite(user.id, token);
            res.json({
                ...result,
                message: 'Convite aceito! Vocês agora compartilham a mesma conta.',
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * GET /api/couple/plan — Get plan status
     */
    static async getPlanStatus(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            if (!user.coupleId) {
                return res.json({
                    planType: 'free',
                    isActive: true,
                    isPro: false,
                    planExpiresAt: null,
                });
            }

            const plan = await CoupleService.getPlanStatus(user.coupleId);
            res.json(plan);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

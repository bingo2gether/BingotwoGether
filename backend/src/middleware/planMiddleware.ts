import { Request, Response, NextFunction } from 'express';
import { CoupleService } from '../services/coupleService.js';

/**
 * Middleware that checks if the user's couple has an active PRO plan.
 * Use on routes that require PRO features.
 */
export const requirePro = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!user.coupleId) {
            return res.status(403).json({
                error: 'Recurso exclusivo para assinantes PRO',
                code: 'PLAN_REQUIRED',
            });
        }

        const plan = await CoupleService.getPlanStatus(user.coupleId);

        if (!plan.isPro) {
            return res.status(403).json({
                error: plan.planType === 'free'
                    ? 'Recurso exclusivo para assinantes PRO'
                    : 'Seu plano expirou. Renove para continuar usando recursos PRO.',
                code: plan.planType === 'free' ? 'PLAN_REQUIRED' : 'PLAN_EXPIRED',
                planType: plan.planType,
                planExpiresAt: plan.planExpiresAt,
            });
        }

        next();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

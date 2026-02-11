import { Request, Response } from 'express';
import prisma from '../prisma.js';
import { NotificationService } from '../services/notifications/notificationService.js';

export class NotificationController {
    static async subscribe(req: Request, res: Response) {
        try {
            const { subscription } = req.body;
            const userId = (req as any).user.id;

            if (!subscription || !subscription.endpoint || !subscription.keys) {
                return res.status(400).json({ error: 'Invalid subscription object' });
            }

            // Upsert subscription
            await prisma.pushSubscription.upsert({
                where: { endpoint: subscription.endpoint },
                update: {
                    userId,
                    keys: subscription.keys
                },
                create: {
                    userId,
                    endpoint: subscription.endpoint,
                    keys: subscription.keys
                }
            });

            res.status(200).json({ success: true });
        } catch (error: any) {
            console.error('Error in subscribe:', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async sendTest(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;

            // Get user subscriptions
            const subscriptions = await prisma.pushSubscription.findMany({
                where: { userId }
            });

            const payload = {
                title: 'Bingo2Gether Test',
                body: 'Notificações funcionando perfeitamente! 🚀',
                icon: '/icon.png'
            };

            const results = await Promise.all(subscriptions.map(async (sub) => {
                const pushSub = {
                    endpoint: sub.endpoint,
                    keys: sub.keys as any
                };
                return NotificationService.sendNotification(pushSub, payload);
            }));

            res.json({ results });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

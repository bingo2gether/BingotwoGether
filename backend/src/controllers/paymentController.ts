import { Request, Response } from 'express';
import { StripeService } from '../services/payments/stripeService.js';
import { MercadoPagoService } from '../services/payments/mercadopagoService.js';
import { CoupleService } from '../services/coupleService.js';
import prisma from '../prisma.js';

export class PaymentController {
    static async createStripeSession(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { planType } = req.body;
            const session = await StripeService.createCheckoutSession(user.id, user.email, planType);
            res.json({ url: session.url });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createMercadoPagoPreference(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { planType } = req.body;
            const preference = await MercadoPagoService.createPreference(user.id, user.email, planType);
            res.json({ init_point: preference.init_point });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async handleStripeWebhook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'] as string;
        let event;

        try {
            event = await StripeService.constructEvent(req.body, sig);
        } catch (err: any) {
            console.error(`Webhook Error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as any;
            const planType = session.metadata?.planType || 'mensal';
            await PaymentController.handleSuccessfulPayment(
                session.client_reference_id,
                'stripe',
                session.id,
                (session.amount_total || 0) / 100,
                planType
            );
        }

        res.json({ received: true });
    }

    static async handleMercadoPagoWebhook(req: Request, res: Response) {
        try {
            const { action, data } = req.body;

            if (action === 'payment.created' || action === 'payment.updated') {
                if (data?.id) {
                    const paymentInfo = await MercadoPagoService.getPayment(data.id);

                    if (paymentInfo.status === 'approved') {
                        const userId = paymentInfo.external_reference;
                        const planType = paymentInfo.metadata?.planType || 'mensal';
                        if (userId) {
                            await PaymentController.handleSuccessfulPayment(
                                userId,
                                'mercadopago',
                                data.id,
                                paymentInfo.transaction_amount || 0,
                                planType
                            );
                        }
                    }
                }
            }

            res.status(200).send('OK');
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Handle successful payment:
     * 1. Ensure user has a couple (auto-create if needed)
     * 2. Upgrade the couple's plan (applies to BOTH users)
     * 3. Log the payment
     */
    private static async handleSuccessfulPayment(
        userId: string,
        provider: string,
        paymentId: string,
        amount: number,
        planType: string = 'mensal'
    ) {
        try {
            // Ensure user has a couple
            const coupleId = await CoupleService.ensureCouple(userId);

            // Upgrade couple's plan
            await CoupleService.upgradePlan(coupleId, planType);

            // Log payment
            await prisma.payment.create({
                data: {
                    coupleId,
                    provider,
                    providerId: paymentId,
                    planType,
                    amount,
                    status: 'completed',
                },
            });

            console.log(`✅ Couple ${coupleId} upgraded to PRO (${planType}) via ${provider}`);
        } catch (error) {
            console.error('Error upgrading couple:', error);
        }
    }
}

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
});

export class StripeService {
    static async createCheckoutSession(userId: string, userEmail: string, planType: string = 'annual') {
        const prices: Record<string, { amount: number; interval: 'month' | 'year' | null; name: string }> = {
            monthly: { amount: 2990, interval: 'month', name: 'Bingo2Gether PRO (Mensal)' },
            annual: { amount: 19990, interval: 'year', name: 'Bingo2Gether PRO (Anual)' },
            lifetime: { amount: 39990, interval: null, name: 'Bingo2Gether PRO (Vitalício)' }
        };

        const plan = prices[planType] || prices.annual;

        return stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: plan.name,
                            description: plan.interval
                                ? `Plano ${planType === 'monthly' ? 'Mensal' : 'Anual'} para o casal.`
                                : 'Acesso Vitalício para o casal. Sem renovações.',
                        },
                        unit_amount: plan.amount,
                        ...(plan.interval ? { recurring: { interval: plan.interval } } : {}),
                    },
                    quantity: 1,
                },
            ],
            mode: plan.interval ? 'subscription' : 'payment',
            customer_email: userEmail,
            client_reference_id: userId,
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            metadata: {
                userId,
                planType,
            },
        });
    }

    static async constructEvent(payload: string | Buffer, sig: string) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET not set');

        return stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    }
}

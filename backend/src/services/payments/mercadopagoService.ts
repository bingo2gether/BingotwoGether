import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export class MercadoPagoService {
    static async createPreference(userId: string, userEmail: string, planType: string = 'annual') {
        const prices: Record<string, { amount: number; name: string }> = {
            monthly: { amount: 29.90, name: 'Bingo2Gether PRO (Mensal)' },
            annual: { amount: 199.90, name: 'Bingo2Gether PRO (Anual)' },
            lifetime: { amount: 399.90, name: 'Bingo2Gether PRO (Vitalício)' }
        };

        const plan = prices[planType] || prices.annual;
        const preference = new Preference(client);

        return preference.create({
            body: {
                items: [
                    {
                        id: planType,
                        title: plan.name,
                        quantity: 1,
                        unit_price: plan.amount,
                        currency_id: 'BRL',
                    }
                ],
                payer: {
                    email: userEmail,
                },
                external_reference: userId,
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/payment/success`,
                    failure: `${process.env.FRONTEND_URL}/payment/failure`,
                    pending: `${process.env.FRONTEND_URL}/payment/pending`,
                },
                auto_return: 'approved',
                notification_url: `${process.env.API_URL}/payment/webhook/mp`,
                metadata: {
                    userId,
                    planType
                }
            }
        });
    }

    static async getPayment(paymentId: string) {
        const payment = new Payment(client);
        return payment.get({ id: paymentId });
    }
}

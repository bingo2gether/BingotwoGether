import api from './api';

export const paymentService = {
    createStripeSession: async (planType: 'monthly' | 'annual' | 'lifetime' = 'annual') => {
        const response = await api.post('/payments/stripe/create-checkout', { planType });
        return response.data; // { url: string }
    },

    createMPPreference: async (planType: 'monthly' | 'annual' | 'lifetime' = 'annual') => {
        const response = await api.post('/payments/mercadopago/create-preference', { planType });
        return response.data; // { init_point: string }
    }
};

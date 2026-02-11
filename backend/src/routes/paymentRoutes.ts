import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import express from 'express';

const router = Router();

// Checkout points (Protected)
router.post('/stripe/create-checkout', authenticate, PaymentController.createStripeSession);
router.post('/mercadopago/create-preference', authenticate, PaymentController.createMercadoPagoPreference);

// Webhooks (Public - Need raw body for Stripe)
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), PaymentController.handleStripeWebhook);
router.post('/webhook/mercadopago', PaymentController.handleMercadoPagoWebhook);

export default router;

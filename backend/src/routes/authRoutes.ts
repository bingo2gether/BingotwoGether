import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';

const router = Router();

// Firebase Auth endpoints
router.post('/firebase-sync', AuthController.firebaseSync);

// Legacy endpoints (kept for backward compatibility)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/google-login', AuthController.googleLogin);
router.get('/me', AuthController.me);

export default router;

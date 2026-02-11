import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/subscribe', authenticate, NotificationController.subscribe);
router.post('/send-test', authenticate, NotificationController.sendTest);

export default router;

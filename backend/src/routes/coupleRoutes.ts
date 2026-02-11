import { Router } from 'express';
import { CoupleController } from '../controllers/coupleController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// All couple routes require authentication
router.use(authenticate);

router.get('/', CoupleController.getCouple);
router.post('/create', CoupleController.createCouple);
router.post('/invite', CoupleController.invitePartner);
router.post('/accept/:token', CoupleController.acceptInvite);
router.get('/plan', CoupleController.getPlanStatus);

export default router;

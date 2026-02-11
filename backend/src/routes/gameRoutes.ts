import { Router } from 'express';
import { GameController } from '../controllers/gameController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', GameController.getGame);

router.post('/sync', GameController.syncGame);
router.delete('/reset', GameController.reset);

export default router;

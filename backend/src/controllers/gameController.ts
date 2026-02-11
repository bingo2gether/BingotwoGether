import { Request, Response } from 'express';
import { GameService } from '../services/gameService.js';
import { CoupleService } from '../services/coupleService.js';

export class GameController {
    /**
     * Get game state — uses coupleId so both users see the same data.
     */
    static async getGame(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            if (!user.coupleId) {
                return res.status(404).json({ error: 'Nenhuma conta compartilhada ativa. Crie uma conta primeiro.' });
            }

            const game = await GameService.getGameByCoupleId(user.coupleId);
            if (!game) return res.status(404).json({ error: 'Game not found' });

            res.json(game.state);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Sync game state — saves to couple's shared state.
     * Auto-creates couple if user doesn't have one.
     */
    static async syncGame(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const { state } = req.body;
            if (!state) return res.status(400).json({ error: 'State is required' });

            // Auto-create couple if needed
            const coupleId = await CoupleService.ensureCouple(user.id);

            const game = await GameService.saveGame(coupleId, state);
            res.json(game.state);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Reset game state for the couple.
     */
    static async reset(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            if (!user.coupleId) {
                return res.status(404).json({ error: 'Nenhuma conta compartilhada ativa' });
            }

            await GameService.resetGame(user.coupleId);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

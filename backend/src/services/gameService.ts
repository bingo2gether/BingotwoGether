import prisma from '../prisma.js';

export class GameService {
    /**
     * Get game state by coupleId (shared between both users)
     */
    static async getGameByCoupleId(coupleId: string) {
        return prisma.game.findFirst({
            where: { coupleId },
            orderBy: { updatedAt: 'desc' },
        });
    }

    /**
     * Save/update game state for a couple
     */
    static async saveGame(coupleId: string, state: any) {
        const existingGame = await prisma.game.findFirst({
            where: { coupleId },
        });

        if (existingGame) {
            return prisma.game.update({
                where: { id: existingGame.id },
                data: {
                    state,
                    isSetup: state.isSetup || false,
                    lastPlayedAt: new Date(),
                },
            });
        }

        return prisma.game.create({
            data: {
                coupleId,
                state,
                isSetup: state.isSetup || false,
                lastPlayedAt: new Date(),
            },
        });
    }

    /**
     * Reset game state for a couple
     */
    static async resetGame(coupleId: string) {
        return prisma.game.deleteMany({
            where: { coupleId },
        });
    }
}

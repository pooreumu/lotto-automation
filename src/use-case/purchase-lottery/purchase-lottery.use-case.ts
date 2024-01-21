import { GameCount } from '../../game-count';

export interface PurchaseLotteryUseCase {
    file: string;
    execute(gameCount: GameCount): Promise<string[]>;
}

export const PURCHASE_LOTTERY_USE_CASE = Symbol('PURCHASE_LOTTERY_USE_CASE');
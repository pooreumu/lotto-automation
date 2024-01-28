import { GameCount } from '../../domain/game-count';

import { PurchaseLottery } from './purchase-lottery';

export interface PurchaseLotteryUseCase {
    file: string;
    execute(gameCount: GameCount): Promise<PurchaseLottery>;
}

export const PURCHASE_LOTTERY_USE_CASE = Symbol('PURCHASE_LOTTERY_USE_CASE');

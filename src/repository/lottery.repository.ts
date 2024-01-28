import { Lottery } from '../entity/lottery.entity';

export interface LotteryRepository {
    getWinningNumbersList(params: { round: number }): Promise<Lottery[]>;
    save(winningNumbers: Lottery): Promise<Lottery>;
}

export const LOTTERY_REPOSITORY = Symbol('LOTTERY_REPOSITORY');

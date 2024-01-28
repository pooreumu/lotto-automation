import { Lottery } from '../entity/lottery.entity';

export interface LotteryRepository {
    findBy(params: { round: number }): Promise<Lottery[]>;
    save(winningNumbers: Lottery): Promise<Lottery>;
}

export const LOTTERY_REPOSITORY = Symbol('LOTTERY_REPOSITORY');

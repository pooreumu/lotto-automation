import { Lottery } from '../entity/lottery.entity';

export interface WinningNumbersRepository {
    getWinningNumbersList(params: { round: number }): Promise<Lottery[]>;
    save(winningNumbers: Lottery): Promise<Lottery>;
}

export const WINNING_NUMBERS_REPOSITORY = Symbol('WINNING_NUMBERS_REPOSITORY');

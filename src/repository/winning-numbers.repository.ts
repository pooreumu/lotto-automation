import { WinningNumbers } from '../entity/winning-numbers.entity';

export interface WinningNumbersRepository {
    getWinningNumbersList(params: { round: number }): Promise<WinningNumbers[]>;
    save(winningNumbers: WinningNumbers): Promise<WinningNumbers>;
}

export const WINNING_NUMBERS_REPOSITORY = Symbol('WINNING_NUMBERS_REPOSITORY');

import { WinningNumbers } from '../entity/winning-numbers.entity';

export interface WinningNumbersRepository {
    getWinningNumbers(): Promise<WinningNumbers>;
}

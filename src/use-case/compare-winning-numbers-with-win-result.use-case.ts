import { Inject, Injectable } from '@nestjs/common';
import {
    WINNING_NUMBERS_REPOSITORY,
    WinningNumbersRepository,
} from '../repository/winning-numbers.repository';
import { Lottery } from '../entity/lottery.entity';
import { CompareWinningNumbersWithWinResultDto } from '../dto/compare-winning-numbers-with-win-result.dto';

@Injectable()
export class CompareWinningNumbersWithWinResultUseCase {
    constructor(
        @Inject(WINNING_NUMBERS_REPOSITORY)
        private readonly winningNumbersRepository: WinningNumbersRepository,
    ) {}

    async execute(params: {
        round: number;
        winResult: number[];
    }): Promise<CompareWinningNumbersWithWinResultDto[]> {
        const lotteries: Lottery[] =
            await this.winningNumbersRepository.getWinningNumbersList({
                round: params.round,
            });
        return lotteries.map((lottery: Lottery) =>
            lottery.toCompareWinningNumbersWithWinResultDto(params.winResult),
        );
    }
}

import { Inject, Injectable } from '@nestjs/common';
import {
    LOTTERY_REPOSITORY,
    LotteryRepository,
} from '../repository/lottery.repository';
import { Lottery } from '../entity/lottery.entity';
import { CompareWinningNumbersWithWinResultDto } from '../dto/compare-winning-numbers-with-win-result.dto';

@Injectable()
export class CompareWinningNumbersWithWinResultUseCase {
    constructor(
        @Inject(LOTTERY_REPOSITORY)
        private readonly lotteryRepository: LotteryRepository,
    ) {}

    async execute(params: {
        round: number;
        winResult: number[];
    }): Promise<CompareWinningNumbersWithWinResultDto[]> {
        const lotteries: Lottery[] = await this.lotteryRepository.findBy({
            round: params.round,
        });
        return lotteries.map((lottery: Lottery) =>
            lottery.toCompareWinningNumbersWithWinResultDto(params.winResult),
        );
    }
}

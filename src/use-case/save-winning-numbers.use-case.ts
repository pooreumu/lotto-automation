import { Inject, Injectable } from '@nestjs/common';
import {
    WINNING_NUMBERS_REPOSITORY,
    WinningNumbersRepository,
} from '../repository/winning-numbers.repository';
import { Lottery } from '../entity/lottery.entity';
import { PurchaseLottery } from './purchase-lottery/purchase-lottery';

@Injectable()
export class SaveWinningNumbersUseCase {
    constructor(
        @Inject(WINNING_NUMBERS_REPOSITORY)
        private readonly winningNumbersRepository: WinningNumbersRepository,
    ) {}

    async execute(purchaseLottery: PurchaseLottery): Promise<Lottery> {
        return await this.winningNumbersRepository.save(
            purchaseLottery.toLottery(),
        );
    }
}

import { Inject, Injectable } from '@nestjs/common';

import { Lottery } from '../entity/lottery.entity';
import {
    LOTTERY_REPOSITORY,
    LotteryRepository,
} from '../repository/lottery.repository';

import { PurchaseLottery } from './purchase-lottery/purchase-lottery';

@Injectable()
export class SaveWinningNumbersUseCase {
    constructor(
        @Inject(LOTTERY_REPOSITORY)
        private readonly lotteryRepository: LotteryRepository,
    ) {}

    async execute(purchaseLottery: PurchaseLottery): Promise<Lottery> {
        return await this.lotteryRepository.save(purchaseLottery.toLottery());
    }
}

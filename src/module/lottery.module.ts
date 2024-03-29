import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Lottery } from '../entity/lottery.entity';
import { LOTTERY_REPOSITORY } from '../repository/lottery.repository';
import { LotteryTypeOrmRepository } from '../repository/lottery.type-orm.repository';
import { LotteryService } from '../service/lottery.service';
import { CompareWinningNumbersWithWinResultUseCase } from '../use-case/compare-winning-numbers-with-win-result/compare-winning-numbers-with-win-result.use-case';
import { GetWinResultLotteryPuppeteerUseCase } from '../use-case/get-win-result-lottery/get-win-result-lottery.puppeteer-use-case';
import { GET_WIN_RESULT_LOTTERY_USE_CASE } from '../use-case/get-win-result-lottery/get-win-result-lottery.use-case';
import { PurchaseLotteryPuppeteerUseCase } from '../use-case/purchase-lottery/purchase-lottery.puppeteer-use-case';
import { PURCHASE_LOTTERY_USE_CASE } from '../use-case/purchase-lottery/purchase-lottery.use-case';
import { SlackUseCase } from '../use-case/slack.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([Lottery])],
    providers: [
        SlackUseCase,
        LotteryService,
        CompareWinningNumbersWithWinResultUseCase,
        {
            provide: PURCHASE_LOTTERY_USE_CASE,
            useClass: PurchaseLotteryPuppeteerUseCase,
        },
        {
            provide: GET_WIN_RESULT_LOTTERY_USE_CASE,
            useClass: GetWinResultLotteryPuppeteerUseCase,
        },
        {
            provide: LOTTERY_REPOSITORY,
            useClass: LotteryTypeOrmRepository,
        },
    ],
})
export class LotteryModule {}

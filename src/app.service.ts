import { Injectable } from '@nestjs/common';
import { PurchaseLotteryUseCase } from './use-case/purchase-lottery.use-case';
import { SlackUseCase } from './use-case/slack.use-case';
import { Cron } from '@nestjs/schedule';
import { GetWinResultLotteryUseCase } from './use-case/get-win-result-lottery.use-case';

@Injectable()
export class AppService {
    constructor(
        private readonly slackUseCase: SlackUseCase,
        private readonly purchaseLotteryUseCase: PurchaseLotteryUseCase,
        private readonly getWinResultLotteryUseCase: GetWinResultLotteryUseCase,
    ) {}

    @Cron('0 0 18 * * 5')
    async purchaseLottery() {
        await this.purchaseLotteryUseCase.execute();
        await this.slackUseCase.sendNotification(
            this.purchaseLotteryUseCase.file,
            'Here you are :four_leaf_clover:',
        );
    }

    @Cron('0 0 22 * * 6')
    async getWinResultLottery() {
        await this.getWinResultLotteryUseCase.execute();
        await this.slackUseCase.sendNotification(
            this.getWinResultLotteryUseCase.file,
            'WINNER WINNER CHICKEN DINNER :trophy:',
        );
    }
}

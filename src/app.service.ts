import { Inject, Injectable, Logger } from '@nestjs/common';
import { PurchaseLotteryPuppeteerUseCase } from './use-case/purchase-lottery.puppeteer-use-case';
import { SlackUseCase } from './use-case/slack.use-case';
import { Cron } from '@nestjs/schedule';
import {
    GET_WIN_RESULT_LOTTERY_USE_CASE,
    GetWinResultLotteryUseCase,
} from './use-case/get-win-result-lottery.use-case';
import { Catch } from './libs/decorator/catch';
import { GameCount } from './game-count';
import * as process from 'process';
import { PURCHASE_LOTTERY_USE_CASE } from './use-case/purchase-lottery.use-case';

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);
    constructor(
        private readonly slackUseCase: SlackUseCase,
        @Inject(PURCHASE_LOTTERY_USE_CASE)
        private readonly purchaseLotteryUseCase: PurchaseLotteryPuppeteerUseCase,
        @Inject(GET_WIN_RESULT_LOTTERY_USE_CASE)
        private readonly getWinResultLotteryUseCase: GetWinResultLotteryUseCase,
    ) {}

    @Catch(AppService.name)
    @Cron('0 0 22 * * 6')
    async getWinResultLottery() {
        this.logger.log('getWinResultLottery');
        await this.getWinResultLotteryUseCase.execute();
        await this.slackUseCase.sendNotification(
            this.getWinResultLotteryUseCase.file,
            'WINNER WINNER CHICKEN DINNER :trophy:',
        );
    }

    @Catch(AppService.name)
    @Cron('0 0 18 * * 1-5')
    async purchaseLotteryFiveGame() {
        await this.purchaseLottery(GameCount.ONE, process.env.MONDAY_MESSAGE);
    }

    private async purchaseLottery(
        gameCount: GameCount,
        title = 'Here you are :four_leaf_clover:',
    ) {
        this.logger.log('purchaseLottery');
        await this.purchaseLotteryUseCase.execute(gameCount);
        this.logger.log(this.purchaseLotteryUseCase.winningNumbers);
        await this.slackUseCase.sendNotification(
            this.purchaseLotteryUseCase.file,
            this.purchaseLotteryUseCase.winningNumbers,
            title,
        );
        this.logger.log('purchaseLottery done');
    }
}

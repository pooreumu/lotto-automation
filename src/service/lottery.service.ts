import { Inject, Injectable, Logger } from '@nestjs/common';
import { PurchaseLotteryPuppeteerUseCase } from '../use-case/purchase-lottery/purchase-lottery.puppeteer-use-case';
import { SlackUseCase } from '../use-case/slack.use-case';
import { Cron } from '@nestjs/schedule';
import {
    GET_WIN_RESULT_LOTTERY_USE_CASE,
    GetWinResultLotteryUseCase,
} from '../use-case/get-win-result-lottery/get-win-result-lottery.use-case';
import { Catch } from '../libs/decorator/catch';
import { GameCount } from '../domain/game-count';
import * as process from 'process';
import { PURCHASE_LOTTERY_USE_CASE } from '../use-case/purchase-lottery/purchase-lottery.use-case';
import { SaveWinningNumbersUseCase } from '../use-case/save-winning-numbers.use-case';

@Injectable()
export class LotteryService {
    private readonly logger = new Logger(LotteryService.name);

    constructor(
        private readonly slackUseCase: SlackUseCase,
        @Inject(PURCHASE_LOTTERY_USE_CASE)
        private readonly purchaseLotteryUseCase: PurchaseLotteryPuppeteerUseCase,
        @Inject(GET_WIN_RESULT_LOTTERY_USE_CASE)
        private readonly getWinResultLotteryUseCase: GetWinResultLotteryUseCase,
        private readonly saveWinningNumbersUseCase: SaveWinningNumbersUseCase,
    ) {}

    @Catch(LotteryService.name)
    @Cron('0 0 22 * * 6')
    async getWinResultLottery() {
        this.logger.log('getWinResultLottery');
        await this.getWinResultLotteryUseCase.execute();
        await this.slackUseCase.sendNotification(
            this.getWinResultLotteryUseCase.file,
            'WINNER WINNER CHICKEN DINNER :trophy:',
        );
    }

    @Catch(LotteryService.name)
    @Cron('0 0 18 * * 1-5')
    async purchaseLotteryFiveGame() {
        await this.purchaseLottery(GameCount.ONE, process.env.MONDAY_MESSAGE);
    }

    private async purchaseLottery(
        gameCount: GameCount,
        title = 'Here you are :four_leaf_clover:',
    ) {
        this.logger.log('purchaseLottery');
        const purchaseLottery = await this.purchaseLotteryUseCase.execute(
            gameCount,
        );
        await this.saveWinningNumbersUseCase.execute(purchaseLottery);
        await this.slackUseCase.sendNotification(
            this.purchaseLotteryUseCase.file,
            JSON.stringify(purchaseLottery.winningNumbers),
            title,
        );
        this.logger.log('purchaseLottery done');
    }
}

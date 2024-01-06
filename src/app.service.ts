import { Injectable, Logger } from '@nestjs/common';
import { PurchaseLotteryPuppeteerUseCase } from './use-case/purchase-lottery.puppeteer.use-case';
import { SlackUseCase } from './use-case/slack.use-case';
import { Cron } from '@nestjs/schedule';
import { GetWinResultLotteryPuppeteerUseCase } from './use-case/get-win-result-lottery.puppeteer.use-case';
import { Catch } from './libs/decorator/catch';
import { GameCount } from './game-count';
import * as process from 'process';

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);
    constructor(
        private readonly slackUseCase: SlackUseCase,
        private readonly purchaseLotteryUseCase: PurchaseLotteryPuppeteerUseCase,
        private readonly getWinResultLotteryUseCase: GetWinResultLotteryPuppeteerUseCase,
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
    @Cron('0 0 18 * * 5')
    async purchaseLotteryOneGame() {
        await this.purchaseLottery(GameCount.ONE, process.env.FRIDAY_MESSAGE);
    }

    @Catch(AppService.name)
    @Cron('0 0 18 * * 1')
    async purchaseLotteryFiveGame() {
        await this.purchaseLottery(GameCount.FOUR, process.env.MONDAY_MESSAGE);
    }

    private async purchaseLottery(
        gameCount: GameCount,
        title = 'Here you are :four_leaf_clover:',
    ) {
        this.logger.log('purchaseLottery');
        await this.purchaseLotteryUseCase.execute(gameCount);
        await this.slackUseCase.sendNotification(
            this.purchaseLotteryUseCase.file,
            this.purchaseLotteryUseCase.winningNumbers,
            title,
        );
        this.logger.log('purchaseLottery done');
    }
}

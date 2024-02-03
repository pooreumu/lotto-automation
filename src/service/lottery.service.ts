import * as process from 'process';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { GameCount } from '../domain/game-count';
import { ERank } from '../domain/rank';
import { Catch } from '../libs/decorator/catch';
import { CompareWinningNumbersWithWinResultUseCase } from '../use-case/compare-winning-numbers-with-win-result.use-case';
import { GetWinResultLottery } from '../use-case/get-win-result-lottery/get-win-result-lottery';
import {
    GET_WIN_RESULT_LOTTERY_USE_CASE,
    GetWinResultLotteryUseCase,
} from '../use-case/get-win-result-lottery/get-win-result-lottery.use-case';
import { PurchaseLotteryPuppeteerUseCase } from '../use-case/purchase-lottery/purchase-lottery.puppeteer-use-case';
import { PURCHASE_LOTTERY_USE_CASE } from '../use-case/purchase-lottery/purchase-lottery.use-case';
import { SaveWinningNumbersUseCase } from '../use-case/save-winning-numbers.use-case';
import { SlackUseCase } from '../use-case/slack.use-case';

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
        private readonly compareWinningNumbersWithWinResultUseCase: CompareWinningNumbersWithWinResultUseCase,
    ) {}

    @Catch(LotteryService.name)
    @Cron('0 0 22 * * 6')
    async getWinResultLottery() {
        this.logger.log('getWinResultLottery');
        const winResultLottery: GetWinResultLottery =
            await this.getWinResultLotteryUseCase.execute();
        const comparisonResults =
            await this.compareWinningNumbersWithWinResultUseCase.execute(
                winResultLottery,
            );
        const ranks = comparisonResults.map((comparisonResult) =>
            ERank.getRank(
                comparisonResult.matchingGeneralNumberCount,
                comparisonResult.matchingBonusNumberCount,
            ),
        );

        await this.slackUseCase.sendNotification(
            this.getWinResultLotteryUseCase.file,
            JSON.stringify(
                ranks.map((rank) => {
                    return {
                        등수: rank.name,
                        상금: rank.prize,
                    };
                }),
            ),
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
        await Promise.all([
            this.saveWinningNumbersUseCase.execute(purchaseLottery),
            this.slackUseCase.sendNotification(
                this.purchaseLotteryUseCase.file,
                JSON.stringify(purchaseLottery.winningNumbers),
                title,
            ),
        ]);
        this.logger.log('purchaseLottery done');
    }
}

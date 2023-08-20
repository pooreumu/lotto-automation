import { Injectable, Logger } from '@nestjs/common';
import { PurchaseLotteryUseCase } from './use-case/purchase-lottery.use-case';
import { SlackUseCase } from './use-case/slack.use-case';
import { Cron } from '@nestjs/schedule';
import { GetWinResultLotteryUseCase } from './use-case/get-win-result-lottery.use-case';
import { Catch } from './libs/decorator/catch';
import { GameCount } from './game-count';

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);
    constructor(
        private readonly slackUseCase: SlackUseCase,
        private readonly purchaseLotteryUseCase: PurchaseLotteryUseCase,
        private readonly getWinResultLotteryUseCase: GetWinResultLotteryUseCase,
    ) {}

    @Catch(AppService.name)
    @Cron('0 0 18 * * 5')
    async purchaseLottery() {
        this.logger.log('purchaseLottery');
        await this.purchaseLotteryUseCase.execute(GameCount.ONE);
        await this.slackUseCase.sendNotification(
            this.purchaseLotteryUseCase.file,
            'Here you are :four_leaf_clover:',
        );
    }

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
}

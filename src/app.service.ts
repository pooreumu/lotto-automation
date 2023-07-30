import { Injectable } from '@nestjs/common';
import { PurchaseLotteryService } from './purchase-lottery.service';
import { SlackService } from './slack.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
    filePath: string;

    constructor(
        private readonly purchaseLotteryService: PurchaseLotteryService,
        private readonly slackService: SlackService,
    ) {
        this.filePath = `${__dirname}/../screenshots`;
    }

    @Cron('0 0 18 * * 5')
    async purchaseLottery() {
        this.assignFilePath();
        await this.purchaseLotteryService.execute(this.filePath);
        await this.slackService.sendNotification(this.filePath);
    }

    private assignFilePath() {
        this.filePath =
            this.filePath + `/${new Date().toISOString()}screenshot.png`;
    }
}

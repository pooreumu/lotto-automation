import { Module } from '@nestjs/common';
import { PurchaseLotteryPuppeteerUseCase } from './use-case/purchase-lottery.puppeteer.use-case';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { SlackUseCase } from './use-case/slack.use-case';
import { AppService } from './app.service';
import { GetWinResultLotteryUseCase } from './use-case/get-win-result-lottery.use-case';

@Module({
    imports: [ScheduleModule.forRoot(), ConfigModule.forRoot()],
    providers: [
        PurchaseLotteryPuppeteerUseCase,
        SlackUseCase,
        AppService,
        GetWinResultLotteryUseCase,
    ],
})
export class AppModule {}

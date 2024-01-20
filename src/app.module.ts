import { Module } from '@nestjs/common';
import { PurchaseLotteryPuppeteerUseCase } from './use-case/purchase-lottery.puppeteer.use-case';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { SlackUseCase } from './use-case/slack.use-case';
import { AppService } from './app.service';
import { GetWinResultLotteryPuppeteerUseCase } from './use-case/get-win-result-lottery.puppeteer-use-case';
import { GET_WIN_RESULT_LOTTERY_USE_CASE } from './use-case/get-win-result-lottery.use-case';

@Module({
    imports: [ScheduleModule.forRoot(), ConfigModule.forRoot()],
    providers: [
        PurchaseLotteryPuppeteerUseCase,
        SlackUseCase,
        AppService,
        {
            provide: GET_WIN_RESULT_LOTTERY_USE_CASE,
            useClass: GetWinResultLotteryPuppeteerUseCase,
        },
    ],
})
export class AppModule {}

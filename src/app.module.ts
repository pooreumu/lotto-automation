import { Module } from '@nestjs/common';

import { PurchaseLotteryUseCase } from './use-case/purchase-lottery.use-case';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { SlackUseCase } from './use-case/slack.use-case';
import { AppService } from './app.service';
import { GetWinResultLotteryUseCase } from './use-case/get-win-result-lottery.use-case';

@Module({
    imports: [ScheduleModule.forRoot(), ConfigModule.forRoot()],
    providers: [
        PurchaseLotteryUseCase,
        SlackUseCase,
        AppService,
        GetWinResultLotteryUseCase,
    ],
})
export class AppModule {}

import { Module } from '@nestjs/common';

import { PurchaseLotteryService } from './purchase-lottery.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { SlackService } from './slack.service';
import { AppService } from './app.service';

@Module({
    imports: [ScheduleModule.forRoot(), ConfigModule.forRoot()],
    providers: [PurchaseLotteryService, SlackService, AppService],
})
export class AppModule {}

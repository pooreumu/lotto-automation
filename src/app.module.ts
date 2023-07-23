import { Module } from '@nestjs/common';

import { PurchaseLottery } from './buy-lottery.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ScheduleModule.forRoot(), ConfigModule.forRoot()],
    providers: [PurchaseLottery],
})
export class AppModule {}

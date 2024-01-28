import { Module } from '@nestjs/common';
import { PurchaseLotteryPuppeteerUseCase } from './use-case/purchase-lottery/purchase-lottery.puppeteer-use-case';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { SlackUseCase } from './use-case/slack.use-case';
import { AppService } from './app.service';
import { GetWinResultLotteryPuppeteerUseCase } from './use-case/get-win-result-lottery/get-win-result-lottery.puppeteer-use-case';
import { GET_WIN_RESULT_LOTTERY_USE_CASE } from './use-case/get-win-result-lottery/get-win-result-lottery.use-case';
import { PURCHASE_LOTTERY_USE_CASE } from './use-case/purchase-lottery/purchase-lottery.use-case';
import { TypeOrmConfigModule } from './common/config/type-orm/type-orm-config.module';
import * as process from 'process';
import path from 'path';
import { SaveWinningNumbersUseCase } from './use-case/save-winning-numbers.use-case';
import { LOTTERY_REPOSITORY } from './repository/lottery.repository';
import { LotteryTypeormRepository } from './repository/lottery.typeorm-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lottery } from './entity/lottery.entity';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath:
                process.env.NODE_ENV === 'test'
                    ? path.join(__dirname, '../.env.test')
                    : path.join(__dirname, '../.env'),
        }),
        TypeOrmConfigModule,
        TypeOrmModule.forFeature([Lottery]),
    ],
    providers: [
        SlackUseCase,
        AppService,
        {
            provide: PURCHASE_LOTTERY_USE_CASE,
            useClass: PurchaseLotteryPuppeteerUseCase,
        },
        {
            provide: GET_WIN_RESULT_LOTTERY_USE_CASE,
            useClass: GetWinResultLotteryPuppeteerUseCase,
        },
        SaveWinningNumbersUseCase,
        {
            provide: LOTTERY_REPOSITORY,
            useClass: LotteryTypeormRepository,
        },
    ],
})
export class AppModule {}

import path from 'path';
import * as process from 'process';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { TypeOrmConfigModule } from './common/config/type-orm/type-orm-config.module';
import { LotteryModule } from './module/lottery.module';

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
        LotteryModule,
    ],
})
export class AppModule {}

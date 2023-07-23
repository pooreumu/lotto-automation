import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ScheduleModule.forRoot(), ConfigModule.forRoot()],
    providers: [AppService],
})
export class AppModule {}

import { LogLevel, WebClient } from '@slack/web-api';
import { Injectable, Logger } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as process from 'process';

@Injectable()
export class SlackService {
    private readonly client: WebClient;
    private readonly logger = new Logger(SlackService.name);

    constructor() {
        this.client = new WebClient(process.env.SLACK_TOKEN, {
            logLevel: LogLevel.DEBUG,
        });
    }

    public async sendNotification(fileName: string) {
        try {
            await this.client.files.upload({
                channels: process.env.SLACK_CHANNEL_ID,
                initial_comment: 'Here you are :smile:',
                file: createReadStream(fileName),
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                this.logger.error(e, e.stack);
            } else {
                this.logger.error(e);
            }
        }
    }
}

import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import { GetWinResultLotteryUseCase } from './get-win-result-lottery.use-case';
import * as path from 'path';

@Injectable()
export class GetWinResultLotteryPuppeteerUseCase
    implements GetWinResultLotteryUseCase
{
    private browser: Browser;
    private page: Page;
    private readonly filePath: string;
    private fileName: string;

    constructor() {
        this.filePath = path.join(process.cwd(), 'screenshots/win-result/');
    }

    async execute() {
        await this.launchBrowser();
        await this.assignNewPage();
        await this.getWinResultPage();
        await this.takeScreenshot();
        await this.closeBrowser();
    }

    public get file() {
        return this.filePath + this.fileName;
    }

    private async launchBrowser() {
        this.browser = await puppeteer.launch({ headless: false });
    }

    private async assignNewPage() {
        this.page = await this.browser.newPage();
    }

    private async closeBrowser() {
        await this.browser.close();
    }

    private async getWinResultPage() {
        await this.page.goto(
            'https://dhlottery.co.kr/gameResult.do?method=byWin',
        );
    }

    private async takeScreenshot() {
        const winResultElement = await this.page.$('.win_result');
        this.fileName =
            (await this.page.$eval(
                '.win_result strong',
                (el) => el.textContent,
            )) + '.png';
        await winResultElement?.screenshot({
            path: this.filePath + this.fileName,
        });
    }
}

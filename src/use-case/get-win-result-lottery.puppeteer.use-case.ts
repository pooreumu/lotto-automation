import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

@Injectable()
export class GetWinResultLotteryPuppeteerUseCase {
    private browser: Browser;
    private page: Page;
    private filePath = `${__dirname}/../../screenshots/win-result/`;
    private fileName: string;

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

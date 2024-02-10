import * as path from 'path';

import { Injectable } from '@nestjs/common';

import puppeteer, { Browser, Page } from 'puppeteer';

import { GetWinResultLottery } from './get-win-result-lottery';
import { GetWinResultLotteryUseCase } from './get-win-result-lottery.use-case';

@Injectable()
export class GetWinResultLotteryPuppeteerUseCase
    implements GetWinResultLotteryUseCase
{
    private browser: Browser;
    private page: Page;
    private readonly filePath: string;
    private fileName: string;
    private round: number;
    private ballNumbers: number[];
    private bonusNumber: number;

    constructor() {
        this.filePath = path.join(process.cwd(), 'screenshots/win-result/');
    }

    async execute() {
        await this.launchBrowser();
        await this.assignNewPage();
        await this.gotoWinResultPage();
        await this.takeScreenshot();
        await Promise.all([
            this.assignBallNumbers(),
            this.assignBonusNumber(),
            this.assignRound(),
        ]);
        await this.closeBrowser();

        return new GetWinResultLottery(
            this.round,
            this.ballNumbers,
            this.bonusNumber,
        );
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

    private async gotoWinResultPage() {
        await Promise.all([
            this.page.goto(
                'https://dhlottery.co.kr/gameResult.do?method=byWin',
            ),
            this.page.waitForNavigation(),
        ]);
    }

    private async takeScreenshot() {
        const winResultElement = await this.page.waitForSelector('.win_result');
        this.fileName =
            (await this.page.$eval(
                '.win_result strong',
                (el) => el.textContent,
            )) + '.png';
        await winResultElement?.screenshot({
            path: this.filePath + this.fileName,
        });
    }

    private async assignBallNumbers() {
        this.ballNumbers = await Promise.all(
            [
                '#article > div:nth-child(2) > div > div.win_result > div > div.num.win > p > span:nth-child(1)',
                '#article > div:nth-child(2) > div > div.win_result > div > div.num.win > p > span:nth-child(2)',
                '#article > div:nth-child(2) > div > div.win_result > div > div.num.win > p > span:nth-child(3)',
                '#article > div:nth-child(2) > div > div.win_result > div > div.num.win > p > span:nth-child(4)',
                '#article > div:nth-child(2) > div > div.win_result > div > div.num.win > p > span:nth-child(5)',
                '#article > div:nth-child(2) > div > div.win_result > div > div.num.win > p > span:nth-child(6)',
            ].map(async (selector) => {
                const ballNumber = await this.page.$eval(
                    selector,
                    (el) => el.textContent,
                );
                if (!ballNumber) {
                    throw new Error('ballNumber is null');
                }
                return +ballNumber;
            }),
        );
    }

    private async assignBonusNumber() {
        this.bonusNumber = await this.page
            .$eval(
                '#article > div:nth-child(2) > div > div.win_result > div > div.num.bonus > p > span',
                (el) => el.textContent,
            )
            .then((bonusNumber) => {
                if (!bonusNumber) {
                    throw new Error('bonusNumber is null');
                }
                return +bonusNumber;
            });
    }

    private async assignRound() {
        this.round = await this.page
            .$eval(
                '#article > div:nth-child(2) > div > div.win_result > h4 > strong',
                (el) => el.textContent,
            )
            .then((round) => round?.replace(/\D/g, ''))
            .then((round) => {
                if (!round) {
                    throw new Error('round is null');
                }
                return +round;
            });
    }
}

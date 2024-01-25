import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, Frame, Page } from 'puppeteer';
import * as process from 'process';
import { GameCount } from '../../game-count';
import { PurchaseLotteryUseCase } from './purchase-lottery.use-case';
import * as path from 'path';

@Injectable()
export class PurchaseLotteryPuppeteerUseCase implements PurchaseLotteryUseCase {
    private browser: Browser;
    private page: Page;
    private frame: Frame;
    private readonly filePath: string;
    private fileName: string;
    private _winningNumbers: string[];

    constructor() {
        this.filePath = path.join(process.cwd(), 'screenshots/');
    }

    public get file(): string {
        return this.filePath + this.fileName;
    }

    async execute(gameCount: GameCount) {
        this.assignFileName();
        await this.assignBrowser();
        await this.login();
        await this.goToPurchasePage();
        await this.assignFrame();
        await this.selectAutomaticNumber(gameCount);
        await this.purchase();
        await this.approvePurchase();
        await this.saveResult();

        await this.closeBrowser();

        return this._winningNumbers;
    }

    private async closeBrowser() {
        await this.browser.close();
    }

    private async login() {
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 1080 });
        await this.page.goto(
            'https://dhlottery.co.kr/user.do?method=login&returnUrl=',
        );
        await this.page.type('input[name=userId]', process.env.USER_ID ?? '');
        await this.page.type('input[name=password]', process.env.USER_PW ?? '');
        const loginButton = await this.page.$('.btn_common.lrg.blu');
        if (!loginButton) {
            throw new Error('loginButton not found');
        }
        await loginButton.click();
    }

    private async assignBrowser() {
        this.browser = await puppeteer.launch({ headless: false });
    }

    private async selectAutomaticNumber(gameCount: GameCount) {
        const automaticNumberButton = await this.frame.$('#num2');
        if (!automaticNumberButton) {
            throw new Error('automaticNumberButton not found');
        }
        await automaticNumberButton.click();

        const selectElement = await this.frame.$('#amoundApply');
        if (!selectElement) {
            throw new Error('selectElement not found');
        }
        await selectElement.select(`${gameCount}`);

        const selectNumberButton = await this.frame.$('#btnSelectNum');
        if (!selectNumberButton) {
            throw new Error('selectNumberButton not found');
        }
        await selectNumberButton.click();
    }

    private async assignFrame() {
        const iframeElementHandle = await this.page.$('#ifrm_tab');
        if (!iframeElementHandle) {
            throw new Error('iframeElementHandle not found');
        }

        const frame = await iframeElementHandle.contentFrame();
        if (!frame) {
            throw new Error('frame not found');
        }
        this.frame = frame;
    }

    private async goToPurchasePage() {
        this.page = await this.browser.newPage();
        await this.page.goto(
            'https://el.dhlottery.co.kr/game/TotalGame.jsp?LottoId=LO40',
        );
    }

    private async purchase() {
        const purchaseButton = await this.frame.$('#btnBuy');
        if (!purchaseButton) {
            throw new Error('purchaseButton not found');
        }
        await purchaseButton.click();
    }

    private async approvePurchase() {
        const popupLayerConfirm = await this.frame.$('#popupLayerConfirm');
        if (!popupLayerConfirm) {
            throw new Error('popupLayerConfirm not found');
        }
        const purchaseConfirmationButton = await popupLayerConfirm.$(
            '.button.lrg.confirm',
        );
        if (!purchaseConfirmationButton) {
            throw new Error('purchaseConfirmationButton not found');
        }
        await purchaseConfirmationButton.click();
    }

    private async saveResult() {
        const popupReceipt = await this.frame.$('#popReceipt');
        if (!popupReceipt) {
            throw new Error('popupReceipt not found');
        }
        try {
            await popupReceipt.screenshot({
                path: `${this.filePath}/${this.fileName}`,
                fullPage: true,
            });
            // #reportRow > li > div.nums
        } catch (e) {
            await this.page.screenshot({
                path: `${this.filePath}/${this.fileName}`,
                fullPage: true,
            });
        }

        console.log('popupReceipt', popupReceipt);
        const winningNumbers = await popupReceipt
            .$eval('#reportRow > li > div.nums', (el) => el.textContent)
            .then((winningNumbers) =>
                winningNumbers
                    ?.split(' ')
                    .filter((num) => num !== '')
                    .map((num) => num.trim()),
            );

        if (winningNumbers) {
            this._winningNumbers = winningNumbers;
        }
    }

    private assignFileName() {
        this.fileName = `${new Date().toISOString()}screenshot.png`;
    }
}

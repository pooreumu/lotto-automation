import * as path from 'path';
import * as process from 'process';

import { Injectable } from '@nestjs/common';

import puppeteer, {
    Browser,
    ElementHandle,
    Frame,
    NodeFor,
    Page,
} from 'puppeteer';

import { GameCount } from '../../domain/game-count';

import { PurchaseLottery } from './purchase-lottery';
import { PurchaseLotteryUseCase } from './purchase-lottery.use-case';

@Injectable()
export class PurchaseLotteryPuppeteerUseCase implements PurchaseLotteryUseCase {
    private browser: Browser;
    private page: Page;
    private frame: Frame;
    private readonly filePath: string;
    private fileName: string;
    private _winningNumbers: string[];
    private _round: string;

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

        return new PurchaseLottery(this._winningNumbers, this._round);
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
        const loginButton = await this.page.waitForSelector(
            '.btn_common.lrg.blu',
        );
        if (!loginButton) {
            throw new Error('loginButton not found');
        }
        await Promise.all([loginButton.click(), this.page.waitForNavigation()]);
    }

    private async assignBrowser() {
        this.browser = await puppeteer.launch({ headless: false });
    }

    private async selectAutomaticNumber(gameCount: GameCount) {
        const automaticNumberButton = await this.frame.waitForSelector('#num2');
        if (!automaticNumberButton) {
            throw new Error('automaticNumberButton not found');
        }
        await automaticNumberButton.click();

        const selectElement = await this.frame.waitForSelector('#amoundApply');
        if (!selectElement) {
            throw new Error('selectElement not found');
        }
        await selectElement.select(`${gameCount}`);

        const selectNumberButton = await this.frame.waitForSelector(
            '#btnSelectNum',
        );
        if (!selectNumberButton) {
            throw new Error('selectNumberButton not found');
        }
        await selectNumberButton.click();
    }

    private async assignFrame() {
        const iframeElementHandle = await this.page.waitForSelector(
            '#ifrm_tab',
        );
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
        await Promise.all([
            this.page.goto(
                'https://el.dhlottery.co.kr/game/TotalGame.jsp?LottoId=LO40',
            ),
            this.page.waitForNavigation(),
        ]);
    }

    private async purchase() {
        const purchaseButton = await this.frame.waitForSelector('#btnBuy');
        if (!purchaseButton) {
            throw new Error('purchaseButton not found');
        }
        await purchaseButton.click();
    }

    private async approvePurchase() {
        const popupLayerConfirm = await this.frame.waitForSelector(
            '#popupLayerConfirm',
        );
        if (!popupLayerConfirm) {
            throw new Error('popupLayerConfirm not found');
        }
        const purchaseConfirmationButton =
            await popupLayerConfirm.waitForSelector('.button.lrg.confirm');
        if (!purchaseConfirmationButton) {
            throw new Error('purchaseConfirmationButton not found');
        }
        await purchaseConfirmationButton.click();
    }

    private async saveResult() {
        const popupReceipt = await this.frame.waitForSelector('#popReceipt');
        if (popupReceipt) {
            await this.getScreenshot(popupReceipt);
            await this.assignWinningNumbers(popupReceipt);
            await this.assignRound(popupReceipt);
        } else {
            await this.page.screenshot({
                path: `${this.filePath}/${this.fileName}`,
                fullPage: true,
            });
        }
    }

    private async getScreenshot(
        popupReceipt: ElementHandle<NodeFor<'#popReceipt'>>,
    ) {
        await popupReceipt.screenshot({
            path: `${this.filePath}/${this.fileName}`,
        });
    }

    private async assignRound(
        popupReceipt: ElementHandle<NodeFor<'#popReceipt'>>,
    ) {
        const round = await popupReceipt
            .$eval('#buyRound', (el) => el.textContent)
            .then((round) => {
                const match = round?.trim().match(/\d+/);
                return match ? match[0] : null;
            });

        if (round) {
            this._round = round;
        }
    }

    private async assignWinningNumbers(
        popupReceipt: ElementHandle<NodeFor<'#popReceipt'>>,
    ) {
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

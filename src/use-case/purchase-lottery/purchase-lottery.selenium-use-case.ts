import * as process from 'process';

import { Injectable, Logger } from '@nestjs/common';

import { Builder, By, WebDriver } from 'selenium-webdriver';
import { WebDriverError } from 'selenium-webdriver/lib/error';

import { GameCount } from '../../domain/game-count';
import { SaveFile } from '../../libs/utils/save-file';

@Injectable()
export class PurchaseLotterySeleniumUseCase {
    private logger = new Logger(PurchaseLotterySeleniumUseCase.name);
    private driver: WebDriver;
    private filePath = `${__dirname}/../../screenshots/`;
    private fileName: string;
    private screenshot: string;

    async execute(gameCount: GameCount) {
        this.assignFileName();
        await this.assignDriver();

        await this.getLotteryPage();
        await this.login();
        await this.getPurchasePage();
        await this.switchToIframe();
        await this.selectAutomaticNumber(gameCount);
        await this.purchase();
        await this.approvePurchase();
        await this.saveResult();

        await this.quitDriver();
    }

    public get file(): string {
        return this.filePath + this.fileName;
    }

    private assignFileName() {
        this.fileName = `${new Date().toISOString()}screenshot.png`;
    }

    private async quitDriver() {
        await this.driver.quit();
    }

    private async assignDriver() {
        this.driver = await new Builder().forBrowser('chrome').build();
    }

    private async saveResult() {
        const popupReceiptElement = await this.driver.findElement(
            By.id('popReceipt'),
        );
        try {
            this.screenshot = await popupReceiptElement.takeScreenshot();
        } catch (e) {
            if (e instanceof WebDriverError) {
                this.screenshot = await this.driver.takeScreenshot();
            } else {
                this.logger.error(e);
            }
        } finally {
            const saveFile = new SaveFile(
                this.filePath,
                this.fileName,
                this.screenshot,
            );
            saveFile.execute();
        }
    }

    private async approvePurchase() {
        const popupLayerForConfirmElement = await this.driver.findElement(
            By.id('popupLayerConfirm'),
        );
        const purchaseConfirmationElement =
            await popupLayerForConfirmElement.findElement(
                By.className('button lrg confirm'),
            );
        await purchaseConfirmationElement.click();
    }

    private async purchase() {
        const purchaseElement = await this.driver.findElement(By.id('btnBuy'));
        await purchaseElement.click();
    }

    private async selectAutomaticNumber(count = 1) {
        const automaticNumberElement = await this.driver.findElement(
            By.id('num2'),
        );
        await automaticNumberElement.click();

        const gameCountElement = await this.driver.findElement(
            By.css(`option[value="${count}"]`),
        );
        await gameCountElement.click();

        const selectNumberElement = await this.driver.findElement(
            By.id('btnSelectNum'),
        );
        await selectNumberElement.click();
    }

    private async switchToIframe() {
        const iframeElement = await this.driver.findElement(By.id('ifrm_tab'));
        await this.driver.switchTo().frame(iframeElement);
    }

    private async getPurchasePage() {
        await this.driver.get(
            'https://el.dhlottery.co.kr/game/TotalGame.jsp?LottoId=LO40',
        );
    }

    private async login() {
        const loginElement = await this.driver.findElement(
            By.className('btn_common sml'),
        );
        await loginElement.click();

        const userIdInputElement = await this.driver.findElement(
            By.name('userId'),
        );
        const passwordInputElement = await this.driver.findElement(
            By.name('password'),
        );
        await userIdInputElement.sendKeys(process.env.USER_ID ?? '');
        await passwordInputElement.sendKeys(process.env.USER_PW ?? '');

        const loginButtonElement = await this.driver.findElement(
            By.className('btn_common lrg blu'),
        );
        await loginButtonElement.click();
    }

    private async getLotteryPage() {
        await this.driver.get(
            'https://dhlottery.co.kr/common.do?method=main&mainMode=default',
        );
    }
}

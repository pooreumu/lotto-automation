import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Builder, By, WebDriver } from 'selenium-webdriver';
import fs from 'fs';

@Injectable()
export class PurchaseLottery {
    @Cron('0 0 18 * * 5')
    async execute() {
        const driver = await new Builder().forBrowser('chrome').build();

        await this.getLotteryPage(driver);
        await this.login(driver);
        await this.getPurchasePage(driver);
        await this.switchToIframe(driver);
        await this.selectAutomaticNumber(driver);
        await this.purchase(driver);
        await this.approvePurchase(driver);
        await this.saveResult(driver);

        await driver.quit();
    }

    private async saveResult(driver: WebDriver) {
        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync(
            `${__dirname}/../screenshots/${new Date().toISOString()}screenshot.png`,
            screenshot,
            'base64',
        );
    }

    private async approvePurchase(driver: WebDriver) {
        const popupLayerForConfirmElement = await driver.findElement(
            By.id('popupLayerConfirm'),
        );
        const purchaseConfirmationElement =
            await popupLayerForConfirmElement.findElement(
                By.className('button lrg confirm'),
            );
        await purchaseConfirmationElement.click();
    }

    private async purchase(driver: WebDriver) {
        const purchaseElement = await driver.findElement(By.id('btnBuy'));
        await purchaseElement.click();
    }

    private async selectAutomaticNumber(driver: WebDriver) {
        const automaticNumberElement = await driver.findElement(By.id('num2'));
        await automaticNumberElement.click();

        const selectNumberElement = await driver.findElement(
            By.id('btnSelectNum'),
        );
        await selectNumberElement.click();
    }

    private async switchToIframe(driver: WebDriver) {
        const iframeElement = await driver.findElement(By.id('ifrm_tab'));
        await driver.switchTo().frame(iframeElement);
    }

    private async getPurchasePage(driver: WebDriver) {
        await driver.get(
            'https://el.dhlottery.co.kr/game/TotalGame.jsp?LottoId=LO40',
        );
    }

    private async login(driver: WebDriver) {
        const loginElement = await driver.findElement(
            By.className('btn_common sml'),
        );
        await loginElement.click();

        const userIdInputElement = await driver.findElement(By.name('userId'));
        const passwordInputElement = await driver.findElement(
            By.name('password'),
        );
        await userIdInputElement.sendKeys(process.env.USER_ID ?? '');
        await passwordInputElement.sendKeys(process.env.USER_PW ?? '');

        const loginButtonElement = await driver.findElement(
            By.className('btn_common lrg blu'),
        );
        await loginButtonElement.click();
    }

    private async getLotteryPage(driver: WebDriver) {
        await driver.get(
            'https://dhlottery.co.kr/common.do?method=main&mainMode=default',
        );
    }
}

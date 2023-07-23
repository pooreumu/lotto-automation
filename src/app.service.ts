import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Builder, By } from 'selenium-webdriver';
import fs from 'fs';

@Injectable()
export class AppService {
    @Cron('0 0 18 * * 5')
    async buyLottery() {
        const driver = await new Builder().forBrowser('chrome').build();

        await driver.get('https://dhlottery.co.kr/common.do?method=main');

        const loginElement = await driver.findElement(
            By.className('btn_common sml'),
        );
        await loginElement.click();

        const userIdInputElement = await driver.findElement(By.name('userId'));
        const passwordInputElement = await driver.findElement(
            By.name('password'),
        );
        await userIdInputElement.sendKeys(process.env.USER_ID ?? '');
        await passwordInputElement.sendKeys(process.env.PASSWORD ?? '');

        const loginButtonElement = await driver.findElement(
            By.className('btn_common lrg blu'),
        );
        await loginButtonElement.click();

        await driver.get(
            'https://el.dhlottery.co.kr/game/TotalGame.jsp?LottoId=LO40',
        );

        const iframeElement = await driver.findElement(By.id('ifrm_tab'));
        await driver.switchTo().frame(iframeElement);

        const automaticNumberElement = await driver.findElement(By.id('num2'));
        await automaticNumberElement.click();

        const selectNumberElement = await driver.findElement(
            By.id('btnSelectNum'),
        );
        await selectNumberElement.click();

        const purchaseElement = await driver.findElement(By.id('btnBuy'));
        await purchaseElement.click();

        const popupLayerForConfirmElement = await driver.findElement(
            By.id('popupLayerConfirm'),
        );
        const purchaseConfirmationElement =
            await popupLayerForConfirmElement.findElement(
                By.className('button lrg confirm'),
            );
        await purchaseConfirmationElement.click();

        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync('screenshot.png', screenshot, 'base64');

        await driver.quit();
    }
}

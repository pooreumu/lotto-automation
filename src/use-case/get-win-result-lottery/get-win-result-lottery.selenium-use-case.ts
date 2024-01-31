import { Injectable } from '@nestjs/common';

import { Builder, By, WebDriver, WebElement } from 'selenium-webdriver';

import { SaveFile } from '../../libs/utils/save-file';

@Injectable()
export class GetWinResultLotterySeleniumUseCase {
    private driver: WebDriver;
    private winResultElement: WebElement;
    private filePath = `${__dirname}/../../screenshots/win-result/`;
    private fileName: string;
    private screenshot: string;

    async execute() {
        await this.assignDriver();
        await this.getWinResultPage();
        await this.assignWinResultElement();
        await this.assignWinResult();
        this.saveWinResult();
        await this.quitDriver();
    }

    public get file() {
        return this.filePath + this.fileName;
    }

    private async assignWinResult() {
        await Promise.all([this.assignScreenshot(), this.assignFileName()]);
    }

    private async quitDriver() {
        await this.driver.quit();
    }

    private async assignDriver() {
        this.driver = await new Builder().forBrowser('chrome').build();
    }

    private async assignScreenshot() {
        this.screenshot = await this.winResultElement.takeScreenshot();
    }

    private saveWinResult() {
        const saveFile = new SaveFile(
            this.filePath,
            this.fileName,
            this.screenshot,
        );
        saveFile.execute();
    }

    private async assignFileName() {
        const winRoundElement = this.winResultElement.findElement(
            By.css('strong'),
        );
        this.fileName = (await winRoundElement.getText()) + '.png';
    }

    private async assignWinResultElement() {
        this.winResultElement = await this.driver.findElement(
            By.className('win_result'),
        );
    }

    private async getWinResultPage() {
        await this.driver.get(
            'https://dhlottery.co.kr/gameResult.do?method=byWin',
        );
    }
}

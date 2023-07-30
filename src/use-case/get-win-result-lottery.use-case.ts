import { Injectable } from '@nestjs/common';
import { Builder, By, WebDriver, WebElement } from 'selenium-webdriver';
import fs from 'fs';

@Injectable()
export class GetWinResultLotteryUseCase {
    private driver: WebDriver;
    private winResultElement: WebElement;
    private _filePath = `${__dirname}/../../screenshots/win-result/`;
    private _fileName: string;
    private screenshot: string;

    async execute() {
        await this.assignDriver();
        await this.getWinResultPage();
        await this.assignWinResultElement();
        await this.assignWinResult();
        this.saveWinResult();
        await this.quitDriver();
    }

    public get filePath() {
        return this._filePath;
    }

    public get fileName() {
        return this._fileName;
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
        if (!fs.existsSync(this._filePath)) {
            fs.mkdirSync(this._filePath, { recursive: true });
        }
        fs.writeFileSync(
            this._filePath + this._fileName,
            this.screenshot,
            'base64',
        );
    }

    private async assignFileName() {
        const winRoundElement = this.winResultElement.findElement(
            By.css('strong'),
        );
        this._fileName = (await winRoundElement.getText()) + '.png';
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

import { Lottery } from '../../entity/lottery.entity';

export class PurchaseLottery {
    public readonly winningNumbers: string[];
    public readonly round: string;
    public readonly remainingBalance: string;

    constructor(
        winningNumbers: string[],
        round: string,
        remainingBalance: string,
    ) {
        this.winningNumbers = winningNumbers;
        this.round = round;
        this.remainingBalance = remainingBalance;
    }

    public toLottery(): Lottery {
        return Lottery.of({
            winningNumbers: this.winningNumbers.map(
                (number: string) => +number,
            ),
            round: +this.round,
        });
    }

    public toSlackMessage(): string {
        return `남은 금액: ${this.remainingBalance}`;
    }
}

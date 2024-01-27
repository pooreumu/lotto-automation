import { Lottery } from '../../entity/lottery.entity';

export class PurchaseLottery {
    public readonly winningNumbers: string[];
    public readonly round: string;

    constructor(winningNumbers: string[], round: string) {
        this.winningNumbers = winningNumbers;
        this.round = round;
    }

    public toLottery(): Lottery {
        return Lottery.of({
            winningNumbers: this.winningNumbers.map(
                (number: string) => +number,
            ),
            round: +this.round,
        });
    }
}

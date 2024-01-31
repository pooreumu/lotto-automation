export class GetWinResultLottery {
    readonly round: string;
    readonly ballNumbers: string[];
    readonly bonus: string;

    constructor(round: string, ballNumbers: string[], bonus: string) {
        this.round = round;
        this.ballNumbers = ballNumbers;
        this.bonus = bonus;
    }
}

export class GetWinResultLottery {
    readonly round: number;
    readonly ballNumbers: number[];
    readonly bonus: number;

    constructor(round: number, ballNumbers: number[], bonus: number) {
        this.round = round;
        this.ballNumbers = ballNumbers;
        this.bonus = bonus;
    }
}

export class CompareWinningNumbersWithWinResult {
    constructor(
        readonly round: number,
        readonly matchingGeneralNumberCount: number,
        readonly matchingBonusNumberCount: number,
        readonly winningNumbers: number[],
    ) {}
}

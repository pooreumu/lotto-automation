export class CompareWinningNumbersWithWinResultDto {
    constructor(
        private readonly round: number,
        private readonly sameNumbersCount: number,
        private readonly createdAt: Date,
    ) {}
}

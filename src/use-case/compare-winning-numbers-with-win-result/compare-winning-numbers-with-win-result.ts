import { ERank } from '../../domain/rank';

export class CompareWinningNumbersWithWinResult {
    constructor(
        readonly round: number,
        readonly matchingGeneralNumberCount: number,
        readonly matchingBonusNumberCount: number,
        readonly winningNumbers: number[],
    ) {}

    public toSlackMessage(): string {
        const rank = ERank.getRank(
            this.matchingGeneralNumberCount,
            this.matchingBonusNumberCount,
        );
        return `
등수: ${rank.name}
상금: ${rank.prize}
번호: ${this.winningNumbers}`;
    }
}

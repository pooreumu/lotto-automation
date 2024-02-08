import { LocalDate } from '@js-joda/core';

import { ERank } from '../../domain/rank';
import { DateTimeUtil } from '../../libs/utils/date-time-util';

export class CompareWinningNumbersWithWinResult {
    constructor(
        readonly round: number,
        readonly matchingGeneralNumberCount: number,
        readonly matchingBonusNumberCount: number,
        readonly winningNumbers: number[],
        readonly createdAt: LocalDate,
    ) {}

    public toSlackMessage(): string {
        const rank = ERank.getRank(
            this.matchingGeneralNumberCount,
            this.matchingBonusNumberCount,
        );
        return `
등수: ${rank.name}
상금: ${rank.prize}
번호: ${this.winningNumbers}
구매날짜: ${DateTimeUtil.toString(this.createdAt)}
`;
    }
}

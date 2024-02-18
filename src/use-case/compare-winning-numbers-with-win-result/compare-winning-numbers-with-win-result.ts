import { LocalDate } from '@js-joda/core';

import { ERank } from '../../domain/rank';
import { DateTimeUtil } from '../../libs/utils/date-time-util';

import { CompareNumber } from './compare-number';

export class CompareWinningNumbersWithWinResult {
    constructor(
        readonly round: number,
        readonly matchingGeneralNumbers: CompareNumber[],
        readonly matchingBonusNumbers: CompareNumber[],
        readonly createdAt: LocalDate,
    ) {}

    private getSameNumberCount(compareNumbers: CompareNumber[]): number {
        return compareNumbers.filter((compareNumber) => compareNumber.isSame)
            .length;
    }

    public toSlackMessage(): string {
        const rank = ERank.getRank(
            this.getSameNumberCount(this.matchingGeneralNumbers),
            this.getSameNumberCount(this.matchingBonusNumbers),
        );
        const generalNumbers = this.matchingGeneralNumbers.map(
            (compareNumber) => {
                return compareNumber.toSlackMessage();
            },
        );
        const bonusNumbers = this.matchingBonusNumbers.map((compareNumber) => {
            return compareNumber.toSlackMessage();
        });

        return rank.code === ERank.SECOND_PLACE.code
            ? `
등수: ${rank.name}
상금: ${rank.prize}
번호: ${generalNumbers}
보너스 번호: ${bonusNumbers}
구매날짜: ${DateTimeUtil.toString(this.createdAt)}
`
            : `
등수: ${rank.name}
상금: ${rank.prize}
번호: ${generalNumbers}
구매날짜: ${DateTimeUtil.toString(this.createdAt)}
`;
    }
}

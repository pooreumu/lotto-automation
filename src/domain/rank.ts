import { BadRequestException } from '@nestjs/common';

import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class ERank extends EnumType<ERank>() {
    static readonly FISRT_PLACE = new ERank('FISRT_PLACE', '1등', '20억원', [
        {
            general: 6,
            bonus: 0,
        },
    ]);
    static readonly SECOND_PLACE = new ERank(
        'SECOND_PLACE',
        '2등',
        '5,000만원',
        [
            {
                general: 5,
                bonus: 1,
            },
        ],
    );
    static readonly THIRD_PLACE = new ERank('THIRD_PLACE', '3등', '150만원', [
        {
            general: 5,
            bonus: 0,
        },
    ]);
    static readonly FOURTH_PLACE = new ERank(
        'FOURTH_PLACE',
        '4등',
        '50,000원',
        [
            {
                general: 4,
                bonus: 0,
            },
            {
                general: 4,
                bonus: 1,
            },
        ],
    );
    static readonly FIFTH_PLACE = new ERank('FIFTH_PLACE', '5등', '5,000원', [
        {
            general: 3,
            bonus: 0,
        },
        {
            general: 3,
            bonus: 1,
        },
    ]);
    static readonly NO_PLACE = new ERank('NO_PLACE', '낙첨', '0원', [
        {
            general: 2,
            bonus: 0,
        },
        {
            general: 2,
            bonus: 1,
        },
        {
            general: 1,
            bonus: 0,
        },
        {
            general: 1,
            bonus: 1,
        },
        {
            general: 0,
            bonus: 0,
        },
        {
            general: 0,
            bonus: 1,
        },
    ]);

    private constructor(
        readonly code: string,
        readonly name: string,
        readonly prize: string,
        readonly matchingNumberCount: {
            general: number;
            bonus: number;
        }[],
    ) {
        super();
    }

    static getRank(
        matchingGeneralNumberCount: number,
        matchingBonusNumberCount: number,
    ): ERank {
        const rank = this.values().find((rank) =>
            rank.matchingNumberCount.some(
                (count) =>
                    count.general === matchingGeneralNumberCount &&
                    count.bonus === matchingBonusNumberCount,
            ),
        );

        if (!rank) {
            throw new BadRequestException('당첨 등수를 찾을 수 없습니다.');
        }

        return rank;
    }
}

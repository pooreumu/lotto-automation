import { ERank } from './rank';

describe('Rank', () => {
    describe('getRank', () => {
        it('6개 번호 일치 하면 1등이다', () => {
            const result = ERank.getRank(6, 0);

            expect(result).toBe(ERank.FIRST_PLACE);
        });

        it('5개 번호 일치 + 보너스 번호 일치 하면 2등이다', () => {
            const result = ERank.getRank(5, 1);

            expect(result).toBe(ERank.SECOND_PLACE);
        });

        it('5개 번호 일치 + 보너스 번호 불일치 하면 3등이다', () => {
            const result = ERank.getRank(5, 0);

            expect(result).toBe(ERank.THIRD_PLACE);
        });

        it.each([
            [4, 0],
            [4, 1],
        ])('4개 번호 일치 하면 4등이다', (general: number, bonus: number) => {
            const result = ERank.getRank(general, bonus);

            expect(result).toBe(ERank.FOURTH_PLACE);
        });

        it.each([
            [3, 0],
            [3, 1],
        ])('3개 번호 일치 하면 5등이다', (general: number, bonus: number) => {
            const result = ERank.getRank(general, bonus);

            expect(result).toBe(ERank.FIFTH_PLACE);
        });

        it.each([
            [2, 0],
            [2, 1],
            [1, 0],
            [1, 1],
            [0, 0],
            [0, 1],
        ])(
            '2개 이하로 번호 일치 하면 낙첨이다',
            (general: number, bonus: number) => {
                const result = ERank.getRank(general, bonus);

                expect(result).toBe(ERank.NO_PLACE);
            },
        );
    });
});

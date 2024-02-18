import { BadRequestException } from '@nestjs/common';

import { Lottery } from './lottery.entity';

describe('Lottery', () => {
    describe('of', () => {
        it('Lottery의 당첨번호(numbers)는 반드시 6자리 입니다.', () => {
            const winningNumbers = Lottery.of({
                winningNumbers: [1, 2, 3, 4, 5, 6],
                round: 1090,
            });

            expect(winningNumbers.winningNumbers).toEqual([1, 2, 3, 4, 5, 6]);
        });

        it('Lottery의 당첨번호(numbers)는 6자리 보다 클 수 없습니다.', () => {
            const winningNumbers = () =>
                Lottery.of({
                    winningNumbers: [1, 2, 3, 4, 5, 6, 7],
                    round: 1090,
                });

            expect(winningNumbers).toThrowError(BadRequestException);
            expect(winningNumbers).toThrowError('numbers length must be 6');
        });

        it('Lottery의 당첨번호(numbers)는 6자리 보다 작을 수 없습니다.', () => {
            const winningNumbers = () =>
                Lottery.of({
                    winningNumbers: [1, 2, 3, 4, 5],
                    round: 1090,
                });

            expect(winningNumbers).toThrowError(BadRequestException);
            expect(winningNumbers).toThrowError('numbers length must be 6');
        });
    });

    describe('getSameNumbers', () => {
        it.each([
            [
                [1, 2, 3, 4, 5, 6],
                [1, 2, 3, 4, 5, 6],
                [
                    { number: 1, isSame: true },
                    { number: 2, isSame: true },
                    { number: 3, isSame: true },
                    { number: 4, isSame: true },
                    { number: 5, isSame: true },
                    { number: 6, isSame: true },
                ],
            ],
            [
                [1, 2, 3, 4, 5, 6],
                [1, 2, 3, 4, 5, 16],
                [
                    { number: 1, isSame: true },
                    { number: 2, isSame: true },
                    { number: 3, isSame: true },
                    { number: 4, isSame: true },
                    { number: 5, isSame: true },
                    { number: 6, isSame: false },
                ],
            ],
            [
                [1, 2, 3, 4, 5, 6],
                [1, 2, 3, 14, 5, 6],
                [
                    { number: 1, isSame: true },
                    { number: 2, isSame: true },
                    { number: 3, isSame: true },
                    { number: 4, isSame: false },
                    { number: 5, isSame: true },
                    { number: 6, isSame: true },
                ],
            ],
            [
                [1, 2, 3, 4, 5, 6],
                [1, 2, 3, 4, 15, 16],
                [
                    { number: 1, isSame: true },
                    { number: 2, isSame: true },
                    { number: 3, isSame: true },
                    { number: 4, isSame: true },
                    { number: 5, isSame: false },
                    { number: 6, isSame: false },
                ],
            ],
            [
                [1, 2, 3, 4, 5, 6],
                [1, 12, 3, 14, 15, 6],
                [
                    { number: 1, isSame: true },
                    { number: 2, isSame: false },
                    { number: 3, isSame: true },
                    { number: 4, isSame: false },
                    { number: 5, isSame: false },
                    { number: 6, isSame: true },
                ],
            ],
            [
                [1, 2, 3, 4, 5, 6],
                [1, 12, 13, 14, 15, 6],
                [
                    { number: 1, isSame: true },
                    { number: 2, isSame: false },
                    { number: 3, isSame: false },
                    { number: 4, isSame: false },
                    { number: 5, isSame: false },
                    { number: 6, isSame: true },
                ],
            ],
            [
                [1, 2, 3, 4, 5, 6],
                [11, 12, 3, 14, 15, 16],
                [
                    { number: 1, isSame: false },
                    { number: 2, isSame: false },
                    { number: 3, isSame: true },
                    { number: 4, isSame: false },
                    { number: 5, isSame: false },
                    { number: 6, isSame: false },
                ],
            ],
            [
                [1, 2, 3, 4, 5, 6],
                [21, 22, 23, 24, 25, 26],
                [
                    { number: 1, isSame: false },
                    { number: 2, isSame: false },
                    { number: 3, isSame: false },
                    { number: 4, isSame: false },
                    { number: 5, isSame: false },
                    { number: 6, isSame: false },
                ],
            ],
        ])(
            '%s과 %s의 비교 결과는 %o입니다.',
            (standard: number[], target: number[], diffNumbersCount) => {
                const winningNumbers = Lottery.of({
                    winningNumbers: standard,
                    round: 1090,
                });

                const sameNumbersCount = winningNumbers.getSameNumbers(target);

                expect(sameNumbersCount).toStrictEqual(diffNumbersCount);
            },
        );
    });
});

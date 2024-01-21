import { WinningNumbers } from './winning-numbers.entity';
import { BadRequestException } from '@nestjs/common';

describe('WinningNumbers', () => {
    describe('of', () => {
        it('WinningNumbers의 당첨번호(numbers)는 반드시 6자리 입니다.', () => {
            const winningNumbers = WinningNumbers.of({
                numbers: [1, 2, 3, 4, 5, 6],
                round: 1090,
            });

            expect(winningNumbers.numbers).toEqual([1, 2, 3, 4, 5, 6]);
        });

        it('WinningNumbers의 당첨번호(numbers)는 6자리 보다 클 수 없습니다.', () => {
            const winningNumbers = () =>
                WinningNumbers.of({
                    numbers: [1, 2, 3, 4, 5, 6, 7],
                    round: 1090,
                });

            expect(winningNumbers).toThrowError(BadRequestException);
            expect(winningNumbers).toThrowError('numbers length must be 6');
        });

        it('WinningNumbers의 당첨번호(numbers)는 6자리 보다 작을 수 없습니다.', () => {
            const winningNumbers = () =>
                WinningNumbers.of({
                    numbers: [1, 2, 3, 4, 5],
                    round: 1090,
                });

            expect(winningNumbers).toThrowError(BadRequestException);
            expect(winningNumbers).toThrowError('numbers length must be 6');
        });
    });

    describe('getSameNumbersCount', () => {
        it.each([
            [[1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6], 6],
            [[1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 16], 5],
            [[1, 2, 3, 4, 5, 6], [1, 2, 3, 14, 5, 6], 5],
            [[1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 15, 16], 4],
            [[1, 2, 3, 4, 5, 6], [1, 12, 3, 14, 15, 6], 3],
            [[1, 2, 3, 4, 5, 6], [1, 12, 13, 14, 15, 6], 2],
            [[1, 2, 3, 4, 5, 6], [11, 12, 3, 14, 15, 16], 1],
            [[1, 2, 3, 4, 5, 6], [21, 22, 23, 24, 25, 26], 0],
        ])(
            '%s과 %s는 같은 숫자가 %개 입니다.',
            (standard: number[], target: number[], diffNumbersCount) => {
                const winningNumbers = WinningNumbers.of({
                    numbers: standard,
                    round: 1090,
                });

                const sameNumbersCount =
                    winningNumbers.getSameNumbersCount(target);

                expect(sameNumbersCount).toBe(diffNumbersCount);
            },
        );
    });
});

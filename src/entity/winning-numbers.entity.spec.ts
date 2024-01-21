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
});

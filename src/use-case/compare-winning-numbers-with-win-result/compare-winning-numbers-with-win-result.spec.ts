import { LocalDate } from '@js-joda/core';

import { CompareNumber } from './compare-number';
import { CompareWinningNumbersWithWinResult } from './compare-winning-numbers-with-win-result';

describe('compare-winning-numbers-with-win-result', () => {
    describe('toSlackMessage', () => {
        it('2등의 메시지에는 보너스 번호가 있어야 한다.', () => {
            const compareWinningNumbersWithWinResult =
                new CompareWinningNumbersWithWinResult(
                    1,
                    [
                        new CompareNumber(1, true),
                        new CompareNumber(2, true),
                        new CompareNumber(3, true),
                        new CompareNumber(4, true),
                        new CompareNumber(5, true),
                        new CompareNumber(6, false),
                    ],
                    [new CompareNumber(6, true)],
                    LocalDate.of(2024, 2, 18),
                );

            expect(
                compareWinningNumbersWithWinResult.toSlackMessage(),
            ).toContain('보너스 번호');
        });

        it('낙첨은 메시지에 보너스 번호가 없다.', () => {
            const compareWinningNumbersWithWinResult =
                new CompareWinningNumbersWithWinResult(
                    1,
                    [new CompareNumber(1, false)],
                    [new CompareNumber(6, false)],
                    LocalDate.of(2024, 2, 18),
                );
            expect(
                compareWinningNumbersWithWinResult.toSlackMessage(),
            ).not.toContain('보너스 번호');
        });

        it('5등은 메시지에 보너스 번호가 없다.', () => {
            const compareWinningNumbersWithWinResult =
                new CompareWinningNumbersWithWinResult(
                    1,
                    [
                        new CompareNumber(1, true),
                        new CompareNumber(2, true),
                        new CompareNumber(3, true),
                    ],
                    [new CompareNumber(6, false)],
                    LocalDate.of(2024, 2, 18),
                );
            expect(
                compareWinningNumbersWithWinResult.toSlackMessage(),
            ).not.toContain('보너스 번호');
        });

        it('4등은 메시지에 보너스 번호가 없다.', () => {
            const compareWinningNumbersWithWinResult =
                new CompareWinningNumbersWithWinResult(
                    1,
                    [
                        new CompareNumber(1, true),
                        new CompareNumber(2, true),
                        new CompareNumber(3, true),
                        new CompareNumber(4, true),
                    ],
                    [new CompareNumber(6, false)],
                    LocalDate.of(2024, 2, 18),
                );
            expect(
                compareWinningNumbersWithWinResult.toSlackMessage(),
            ).not.toContain('보너스 번호');
        });

        it('3등은 메시지에 보너스 번호가 없다.', () => {
            const compareWinningNumbersWithWinResult =
                new CompareWinningNumbersWithWinResult(
                    1,
                    [
                        new CompareNumber(1, true),
                        new CompareNumber(2, true),
                        new CompareNumber(3, true),
                        new CompareNumber(4, true),
                        new CompareNumber(5, true),
                    ],
                    [new CompareNumber(6, false)],
                    LocalDate.of(2024, 2, 18),
                );
            expect(
                compareWinningNumbersWithWinResult.toSlackMessage(),
            ).not.toContain('보너스 번호');
        });

        it('1등은 메시지에 보너스 번호가 없다.', () => {
            const compareWinningNumbersWithWinResult =
                new CompareWinningNumbersWithWinResult(
                    1,
                    [
                        new CompareNumber(1, true),
                        new CompareNumber(2, true),
                        new CompareNumber(3, true),
                        new CompareNumber(4, true),
                        new CompareNumber(5, true),
                        new CompareNumber(6, true),
                    ],
                    [new CompareNumber(6, false)],
                    LocalDate.of(2024, 2, 18),
                );
            expect(
                compareWinningNumbersWithWinResult.toSlackMessage(),
            ).not.toContain('보너스 번호');
        });
    });
});

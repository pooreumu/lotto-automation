import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { CompareWinningNumbersWithWinResultDto } from '../dto/compare-winning-numbers-with-win-result.dto';

@Entity()
export class WinningNumbers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    numbers: number[];

    @Column()
    round: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    public static of(params: {
        numbers: number[];
        round: number;
    }): WinningNumbers {
        this.validateNumbers(params.numbers);

        const winningNumbers = new WinningNumbers();
        winningNumbers.numbers = params.numbers;
        winningNumbers.round = params.round;

        return winningNumbers;
    }

    private static validateNumbers(numbers: number[]) {
        if (numbers.length !== 6) {
            throw new BadRequestException('numbers length must be 6');
        }
    }

    public getSameNumbersCount(numbers: number[]): number {
        WinningNumbers.validateNumbers(numbers);

        return this.numbers.filter((number) => numbers.includes(number)).length;
    }

    public toCompareWinningNumbersWithWinResultDto(
        numbers: number[],
    ): CompareWinningNumbersWithWinResultDto {
        return new CompareWinningNumbersWithWinResultDto(
            this.round,
            this.getSameNumbersCount(numbers),
            this.createdAt,
        );
    }
}

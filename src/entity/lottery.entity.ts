import { BadRequestException } from '@nestjs/common';

import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { CompareWinningNumbersWithWinResultDto } from '../dto/compare-winning-numbers-with-win-result.dto';
import { GetWinResultLottery } from '../use-case/get-win-result-lottery/get-win-result-lottery';

@Entity()
export class Lottery {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'int',
        array: true,
    })
    winningNumbers: number[];

    @Column()
    round: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    public static of(params: {
        winningNumbers: number[];
        round: number;
    }): Lottery {
        this.validateNumbers(params.winningNumbers);

        const winningNumbers = new Lottery();
        winningNumbers.winningNumbers = params.winningNumbers;
        winningNumbers.round = params.round;

        return winningNumbers;
    }

    private static validateNumbers(numbers: number[]) {
        if (numbers.length !== 6) {
            throw new BadRequestException('numbers length must be 6');
        }
    }

    public getSameNumbersCount(numbers: number[]): number {
        return this.winningNumbers.filter((number) => numbers.includes(number))
            .length;
    }

    public toCompareWinningNumbersWithWinResultDto(
        winResultLottery: GetWinResultLottery,
    ): CompareWinningNumbersWithWinResultDto {
        return new CompareWinningNumbersWithWinResultDto(
            this.round,
            this.getSameNumbersCount(winResultLottery.ballNumbers),
            this.getSameNumbersCount([winResultLottery.bonus]),
            this.createdAt,
        );
    }
}

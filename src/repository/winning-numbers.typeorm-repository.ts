import { WinningNumbers } from 'src/entity/winning-numbers.entity';
import { WinningNumbersRepository } from './winning-numbers.repository';
import { Repository } from 'typeorm';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WinningNumbersTypeormRepository
    implements WinningNumbersRepository
{
    constructor(
        @InjectRepository(WinningNumbers)
        private readonly repository: Repository<WinningNumbers>,
    ) {}

    async getWinningNumbersList({
        round,
    }: {
        round: number;
    }): Promise<WinningNumbers[]> {
        return await this.repository.find({
            where: {
                round,
            },
        });
    }

    save(winningNumbers: WinningNumbers): Promise<WinningNumbers> {
        throw new NotImplementedException('Method not implemented.');
    }
}

import { WinningNumbers } from 'src/entity/winning-numbers.entity';
import { WinningNumbersRepository } from './winning-numbers.repository';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WinningNumbersTypeormRepository
    extends Repository<WinningNumbers>
    implements WinningNumbersRepository
{
    constructor(
        @InjectRepository(WinningNumbers)
        private readonly repository: Repository<WinningNumbers>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
    getWinningNumbers(): Promise<WinningNumbers> {
        throw new Error('Method not implemented.');
    }
}

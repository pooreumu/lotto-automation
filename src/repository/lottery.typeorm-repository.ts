import { Lottery } from 'src/entity/lottery.entity';
import { LotteryRepository } from './lottery.repository';
import { Repository } from 'typeorm';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LotteryTypeormRepository implements LotteryRepository {
    constructor(
        @InjectRepository(Lottery)
        private readonly repository: Repository<Lottery>,
    ) {}

    async getWinningNumbersList({
        round,
    }: {
        round: number;
    }): Promise<Lottery[]> {
        return await this.repository.find({
            where: {
                round,
            },
        });
    }

    save(winningNumbers: Lottery): Promise<Lottery> {
        throw new NotImplementedException('Method not implemented.');
    }
}

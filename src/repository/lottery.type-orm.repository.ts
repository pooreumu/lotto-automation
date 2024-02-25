import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Lottery } from '../entity/lottery.entity';

import { LotteryRepository } from './lottery.repository';

@Injectable()
export class LotteryTypeOrmRepository implements LotteryRepository {
    constructor(
        @InjectRepository(Lottery)
        private readonly repository: Repository<Lottery>,
    ) {}

    async findBy({ round }: { round: number }): Promise<Lottery[]> {
        return await this.repository.find({
            where: {
                round,
            },
        });
    }

    async save(lottery: Lottery): Promise<Lottery> {
        return await this.repository.save(lottery);
    }
}

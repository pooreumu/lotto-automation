import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { Lottery } from '../entity/lottery.entity';
import { LOTTERY_REPOSITORY, LotteryRepository } from './lottery.repository';
import { AppModule } from '../app.module';

describe('LotteryTypeOrmRepository', () => {
    let module: TestingModule;
    let lotteryTypeOrmRepository: LotteryRepository;
    let dataSource: DataSource;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        lotteryTypeOrmRepository =
            module.get<LotteryRepository>(LOTTERY_REPOSITORY);
        dataSource = module.get<DataSource>(DataSource);

        await dataSource.synchronize(true);
    });

    afterEach(async () => {
        await module.close();
    });

    describe('save', () => {
        it('Lottery를 저장할 수 있어야 합니다.', async () => {
            const lottery = Lottery.of({
                winningNumbers: [1, 2, 3, 4, 5, 6],
                round: 1104,
            });

            await lotteryTypeOrmRepository.save(lottery);

            const [lotteryFromDb] = await dataSource
                .getRepository(Lottery)
                .find();
            expect(lotteryFromDb.winningNumbers).toEqual([1, 2, 3, 4, 5, 6]);
            expect(lotteryFromDb.round).toEqual(1104);
        });

        it('저장한 값을 반환할 수 있어야 합니다.', async () => {
            const lottery = Lottery.of({
                winningNumbers: [1, 2, 3, 4, 5, 6],
                round: 1104,
            });

            const result = await lotteryTypeOrmRepository.save(lottery);

            expect(result).toBeInstanceOf(Lottery);
            expect(result.id).toBeDefined();
            expect(result.winningNumbers).toEqual([1, 2, 3, 4, 5, 6]);
            expect(result.round).toEqual(1104);
        });
    });
});

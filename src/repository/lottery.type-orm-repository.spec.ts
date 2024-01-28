import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { Lottery } from '../entity/lottery.entity';
import { LOTTERY_REPOSITORY, LotteryRepository } from './lottery.repository';
import { AppModule } from '../app.module';

describe('LotteryTypeOrmRepository', () => {
    let module: TestingModule;
    let lotteryRepository: LotteryRepository;
    let dataSource: DataSource;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        lotteryRepository = module.get<LotteryRepository>(LOTTERY_REPOSITORY);
        dataSource = module.get<DataSource>(DataSource);

        await dataSource.synchronize(true);
    });

    describe('save', () => {
        it('Lottery를 저장할 수 있어야 합니다.', async () => {
            const lottery = Lottery.of({
                winningNumbers: [1, 2, 3, 4, 5, 6],
                round: 1104,
            });

            await lotteryRepository.save(lottery);

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

            const result = await lotteryRepository.save(lottery);

            expect(result).toBeInstanceOf(Lottery);
            expect(result.id).toBeDefined();
            expect(result.winningNumbers).toEqual([1, 2, 3, 4, 5, 6]);
            expect(result.round).toEqual(1104);
        });
    });

    describe('findBy', () => {
        it('특정 회차에 구매한 모든 Lottery를 반환할 수 있어야 합니다.', async () => {
            const lotteries = [
                Lottery.of({
                    winningNumbers: [1, 2, 3, 4, 5, 6],
                    round: 1104,
                }),
                Lottery.of({
                    winningNumbers: [11, 12, 13, 14, 15, 16],
                    round: 1104,
                }),
                Lottery.of({
                    winningNumbers: [21, 22, 23, 24, 25, 26],
                    round: 1103,
                }),
                Lottery.of({
                    winningNumbers: [31, 32, 33, 34, 35, 36],
                    round: 1105,
                }),
            ];
            await dataSource.getRepository(Lottery).insert(lotteries);

            const result = await lotteryRepository.findBy({
                round: 1104,
            });

            expect(result.length).toBe(2);
            expect(result[0].round).toBe(1104);
            expect(result[0].winningNumbers).toEqual([1, 2, 3, 4, 5, 6]);
            expect(result[1].round).toBe(1104);
            expect(result[1].winningNumbers).toEqual([11, 12, 13, 14, 15, 16]);
        });
    });
});

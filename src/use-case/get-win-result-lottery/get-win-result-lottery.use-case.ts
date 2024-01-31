import { GetWinResultLottery } from './get-win-result-lottery';

export interface GetWinResultLotteryUseCase {
    file: string;
    execute(): Promise<GetWinResultLottery>;
}

export const GET_WIN_RESULT_LOTTERY_USE_CASE = Symbol(
    'GET_WIN_RESULT_LOTTERY_USE_CASE',
);

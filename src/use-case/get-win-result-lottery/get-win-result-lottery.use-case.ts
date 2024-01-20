export interface GetWinResultLotteryUseCase {
    file: string;
    execute(): Promise<void>;
}

export const GET_WIN_RESULT_LOTTERY_USE_CASE = Symbol(
    'GET_WIN_RESULT_LOTTERY_USE_CASE',
);

export const GameCount = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
} as const;

export type GameCount = (typeof GameCount)[keyof typeof GameCount];

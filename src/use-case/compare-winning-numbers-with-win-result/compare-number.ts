export class CompareNumber {
    constructor(readonly winningNumber: number, readonly isSame: boolean) {}

    toSlackMessage() {
        return this.isSame
            ? `\`${this.winningNumber}\``
            : `${this.winningNumber}`;
    }
}

export class CompareNumber {
    constructor(readonly number: number, readonly isSame: boolean) {}

    toSlackMessage() {
        return this.isSame ? `\`${this.number}\`` : `${this.number}`;
    }
}

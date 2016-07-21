import {isDefined, isNumber} from '../helpers/type';
const distanceExpression = /(-{0,1}[0-9.]+)%{0,1}/;

export class Percentage {

    public value: number;
    public unit: string;

    public static from(val: string | number): Percentage {
        if (!isDefined(val)) {
            return undefined;
        }
        if (isNumber(val)) {
            return new Percentage(val as number);
        }

        const match = distanceExpression.exec(val as string);
        const value = parseFloat(match[1]);

        return new Percentage(value);
    }

    constructor(value: number) {
        this.value = value;
    }

    public toString(): string {
        return `${this.value}%`;
    }
}

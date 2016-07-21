import {isDefined, isNumber} from '../helpers/type';
const distanceExpression = /(-{0,1}[0-9.]+)(em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|q|cm|in|pt|pc|\%){0,1}/;

export class Distance {
    public static em: string = 'em';
    public static ex: string = 'ex';
    public static ch: string = 'ch';
    public static rem: string = 'rem';
    public static vh: string = 'vh';
    public static vw: string = 'vw';
    public static vmin: string = 'vmin';
    public static vmax: string = 'vmax';
    public static px: string = 'px';
    public static mm: string = 'mm';
    public static q: string = 'q';
    public static cm: string = 'cm';
    public static inch: string = 'in';
    public static point: string = 'pt';
    public static pica: string = 'pc';
    public static percent: string = '%';

    public value: number;
    public unit: string;

    public static from(val: string | number): Distance {
        if (!isDefined(val)) {
            return undefined;
        }
        if (isNumber(val)) {
            return new Distance(val as number, Distance.px);
        }

        const match = distanceExpression.exec(val as string);
        const unit = match[2];
        const value = parseFloat(match[1]);

        return new Distance(value, unit);
    }

    constructor(value: number, unit: string) {
        this.value = value;
        this.unit = unit;
    }

    public toString(): string {
        return `${this.value}${this.unit}`;
    }
}

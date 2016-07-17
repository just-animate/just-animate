import {isNumber} from '../helpers/type';
const timeExpression = /([+-][=]){0,1}([0-9]+[\.]{0,1}[0-9]*){1}(s|ms){0,1}/;

export class Time {
    public static STAGGER_NONE: number = 0;
    public static STAGGER_INCREASE: number = 1;
    public static STAGGER_DECREASE: number = -1;

    public value: number;
    public stagger: number;

    public static from(val: string | number): Time {
        if (isNumber(val)) {
            return new Time(val as number, Time.STAGGER_NONE);
        }

        const match = timeExpression.exec(val as string);
        const operator = match[1] || '=';
        const unit = match[3];
        const value = parseFloat(match[2]);

        let valueMs: number;
        if (unit === undefined || unit === 'ms') {
            valueMs = value;
        } else if (unit === 's') {
            valueMs = value * 1000;
        } else {
            throw Error('bad time format');
        }

        let operatorEnum: number;
        switch (operator) {
            case '+=':
                operatorEnum = Time.STAGGER_INCREASE;
                break;
            case '-=':
                operatorEnum = Time.STAGGER_DECREASE;
                break;
            default:
                operatorEnum = Time.STAGGER_NONE;
                break;
        }
        return new Time(valueMs, operatorEnum);
    }

    constructor(value: number, stagger: number) {
        this.value = value;
        this.stagger = stagger;
    }
}

import {isNumber} from './utils';

const matcher = /([+-][=]){0,1}([0-9]+[\.]{0,1}[0-9]*){1}(s|ms){0,1}/;

export function toTime(val: string | number): { operator: string, value: number } {
    if (isNumber(val)) {
        return {
            operator: '=',
            value: val as number
        };
    }
    const match = matcher.exec(val as string);
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

    return {
        operator: operator,
        value: valueMs
    }
}
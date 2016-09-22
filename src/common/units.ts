import { isDefined, isNumber } from './type';
import { distanceExpression, percentageExpression, timeExpression, nil } from './resources';
import { invalidArg } from './errors';

export const stepNone: string = '=';
export const stepForward: string = '+=';
export const stepBackward: string = '-=';

export const em: string = 'em';
export const ex: string = 'ex';
export const ch: string = 'ch';
export const rem: string = 'rem';
export const vh: string = 'vh';
export const vw: string = 'vw';
export const vmin: string = 'vmin';
export const vmax: string = 'vmax';
export const px: string = 'px';
export const mm: string = 'mm';
export const q: string = 'q';
export const cm: string = 'cm';
export const inch: string = 'in';
export const point: string = 'pt';
export const pica: string = 'pc';
export const percent: string = '%';
export const millisecond: string = 'ms';
export const second: string = 's';

export interface IUnit {
    step: string;
    unit: string;
    value: number;
    values(value: number, unit: string, step: string): IUnit;
    toString(): string;
}

export function Unit(): IUnit {
    const self = this instanceof Unit ? this : Object.create(Unit.prototype);
    return self;
}

Unit.prototype = {
    step: nil as string,
    unit: nil as string,
    value: nil as number,
    values(value: number, unit: string, step: string): IUnit {
        const self = this;
        self.value = value;
        self.unit = unit;
        self.step = step;
        return self;
    },
    toString(): string {
        return String(this.value) + this.unit;
    }
};

const sharedUnit = Unit();


export function fromDistance(val: string | number, unit?: IUnit): IUnit {
    if (!isDefined(val)) {
        return nil;
    }

    const returnUnit = unit || Unit();    
    if (isNumber(val)) {
        return returnUnit.values(Number(val), px, stepNone);
    }

    const match = distanceExpression.exec(val as string);
    const unitType = match[2];
    const value = parseFloat(match[1]);

    return returnUnit.values(value, unitType, stepNone);
}

export function fromPercentage(val: string | number, unit?: IUnit): IUnit {
    if (!isDefined(val)) {
        return nil;
    }

    const returnUnit = unit || Unit();
    if (isNumber(val)) {
        return returnUnit.values(Number(val), percent, stepNone);
    }

    const match = percentageExpression.exec(val as string);
    const value = parseFloat(match[1]);

    return returnUnit.values(value, percent, stepNone);
}


export function fromTime(val: string | number, unit?: IUnit): IUnit {
    const returnUnit = unit || Unit();
    if (isNumber(val)) {
        return returnUnit.values(Number(val), millisecond, stepNone);
    }

    const match = timeExpression.exec(val as string);
    const step = match[1] || stepNone;
    const unitType = match[3];
    const value = parseFloat(match[2]);

    let valueMs: number;
    if (unitType === nil || unitType === millisecond) {
        valueMs = value;
    } else if (unitType === second) {
        valueMs = value * 1000;
    } else {
        throw invalidArg('format');
    }
    return returnUnit.values(valueMs, millisecond, step);
}

export function resolveTimeExpression(val: string | number, index: number): number {
    fromTime(val, sharedUnit);
    if (sharedUnit.step === stepForward) {
        return sharedUnit.value * index;
    }
    if (sharedUnit.step === stepBackward) {
        return sharedUnit.value * index * -1;
    }
    return sharedUnit.value;
}


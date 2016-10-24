import { isDefined, isNumber } from './type';
import { measureExpression, unitExpression } from './resources';
import { random } from './random';

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


export function createUnitResolver(val: string | number): UnitResolver {
    if (!isDefined(val)) {
        return () => undefined;
    } 
    if (isNumber(val)) {
        return () => ({ unit: undefined, value: val as number });
    }

    const match = unitExpression.exec(val as string);
    const stepTypeString = match[1];
    const startString = match[2];    
    const toOperator = match[3];  
    const endValueString = match[4];
    const unitTypeString = match[5];    

    const startCo = startString ? parseFloat(startString) : undefined;
    const endCo = endValueString ? parseFloat(endValueString) : undefined; 
    const sign = stepTypeString === stepBackward ? -1 : 1;
    const isIndexed = !!stepTypeString;
    const isRange = toOperator === 'to';

    const resolver = (index?: number) => {
        const index2 = isIndexed && isDefined(index) ? index + 1 : 1;
        const value = isRange
            ? random(startCo * (index2) * sign, (endCo - startCo) * index2 * sign) as number
            : startCo * index2 * sign;
        
        return {
            unit: unitTypeString || undefined,
            value: value
        };
    };

    return resolver;
}

export function parseUnit(val: string | number, output?: Unit): Unit {
    output = output || {} as Unit;

    if (!isDefined(val)) {
        output.unit = undefined;
        output.value = undefined;
    } else if (isNumber(val)) {
        output.unit = undefined;        
        output.value = val as number;
    } else {
        const match = measureExpression.exec(val as string);
        const startString = match[1];    
        const unitTypeString = match[2];  
        
        output.unit = unitTypeString || undefined;
        output.value = startString ? parseFloat(startString) : undefined;
    }
    
    return output;
}

export function getCanonicalTime(unit: Unit): number {
    if (unit.unit === 's') {
        return unit.value * 1000;
    }
    return unit.value;
}

export type Unit = {
    value: number;
    unit: string;
}

export type UnitResolver = {
    (index: number): Unit;
};

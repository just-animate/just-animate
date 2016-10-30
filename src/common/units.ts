import { isDefined, isNumber } from './type';
import { measureExpression, unitExpression } from './resources';
import { random } from './random';

export const stepNone: string = '=';
export const stepForward: string = '+=';
export const stepBackward: string = '-=';

/**
 * Returns a unit resolver.  The unit resolver returns what the unit should be
 * at a given index.  for instance +=200 should be 200 at 0, 400 at 1, and 600 at 2
 */
export function createUnitResolver(val: string | number): UnitResolver {
    if (!isDefined(val)) {
        return () => ({ unit: undefined, value: 0 });
    } 
    if (isNumber(val)) {
        return () => ({ unit: undefined, value: val as number });
    }

    const match = unitExpression.exec(val as string) as RegExpExecArray;
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

/**
 * Parses a string or number and returns the unit and numeric value
 */
export function parseUnit(val: string | number | undefined, output?: Unit): Unit {
    output = output || {} as Unit;

    if (!isDefined(val)) {
        output.unit = undefined;
        output.value = undefined;
    } else if (isNumber(val)) {
        output.unit = undefined;        
        output.value = val as number;
    } else {
        const match = measureExpression.exec(val as string) as RegExpExecArray;
        const startString = match[1];    
        const unitTypeString = match[2];  
        
        output.unit = unitTypeString || undefined;
        output.value = startString ? parseFloat(startString) : undefined;
    }
    
    return output;
}

/**
 * returns the unit as a number (resolves seconds to milliseconds)
 */
export function getCanonicalTime(unit: Unit): number | undefined {
    if (unit.unit === 's') {
        return unit.value * 1000;
    }
    return unit.value;
}

export type Unit = {
    value: number | undefined;
    unit: string | undefined;
}

export type UnitResolver = {
    (index: number): Unit;
};

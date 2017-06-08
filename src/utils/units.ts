import { isDefined, isNumber } from './type'
import { measureExpression, unitExpression } from './resources'
import { random } from './random'
import { _ } from '.'

export const stepNone = '='
export const stepForward = '+='
export const stepBackward = '-='

/**
 * Returns a unit resolver.  The unit resolver returns what the unit should be
 * at a given index.  for instance +=200 should be 200 at 0, 400 at 1, and 600 at 2
 */
export const unitResolver = (val: string | number): UnitResolver => {
    if (!isDefined(val)) {
        return () => ({ unit: _, value: 0 })
    }
    if (isNumber(val)) {
        return () => ({ unit: _, value: val as number })
    }

    const match = unitExpression.exec(val as string) as RegExpExecArray
    const stepTypeString = match[1]
    const startString = match[2]
    const toOperator = match[3]
    const endValueString = match[4]
    const unitTypeString = match[5]

    const startCo = startString ? parseFloat(startString) : 0
    const endCo = endValueString ? parseFloat(endValueString) : 0
    const sign = stepTypeString === stepBackward ? -1 : 1
    const isIndexed = !!stepTypeString
    const isRange = toOperator === 'to'

    const resolver = (index?: number) => {
        const index2 = isIndexed && isDefined(index) ? (index || 0) + 1 : 1
        const value = isRange
            ? random(startCo * (index2) * sign, (endCo - startCo) * index2 * sign) as number
            : startCo * index2 * sign

        return {
            unit: unitTypeString || _,
            value: value
        }
    }

    return resolver
}

/**
 * Parses a string or number and returns the unit and numeric value
 */
export const parseUnit = (val: string | number, output?: Unit): Unit => {
    output = output || {} as Unit

    if (!isDefined(val)) {
        output.unit = _
        output.value = _
    } else if (isNumber(val)) {
        output.unit = _
        output.value = val as number
    } else {
        const match = measureExpression.exec(val as string) as RegExpExecArray
        const startString = match[1]
        const unitTypeString = match[2]

        output.unit = unitTypeString || _
        output.value = startString ? parseFloat(startString) : _
    }

    return output
}

/**
 * returns the unit as a number (resolves seconds to milliseconds)
 */
export const convertToMs = (unit: Unit): number => {
    return (unit.value || 0) * (unit.unit === 's' ? 1000 : 1)
}

export type Unit = {
    value: number;
    unit?: string;
}

export type UnitResolver = {
    (index: number): Unit;
}

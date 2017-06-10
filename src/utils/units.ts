import { isDefined, isNumber } from './type'
import { _, measureExpression, unitExpression } from './resources'

export const stepNone = '='
export const stepForward = '+='
export const stepBackward = '-='

/**
 * Returns a unit resolver.  The unit resolver returns what the unit should be
 * at a given index.  for instance +=200 should be 200 at 0, 400 at 1, and 600 at 2
 */
export const unitResolver = (val: string | number): UnitResolver => {
    if (isDefined(val) && !isNumber(val)) {
        const match = unitExpression.exec(val as string) as RegExpExecArray
        if (match) {
            const stepTypeString = match[1]
            const startString = match[2]
            const unitTypeString = match[3]

            const startCo = startString ? parseFloat(startString) : 0
            const sign = stepTypeString === stepBackward ? -1 : 1
            return (index?: number) => ({
                unit: unitTypeString || _,
                value: startCo * (stepTypeString && isDefined(index) ? (index || 0) + 1 : 1) * sign
            })
        }
    }
    return () => val
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
export const convertToMs = (unit: Unit | string | number) => {
    if (unit && (unit as Unit).value) {
        return ((unit as Unit).value || 0) * ((unit as Unit).unit === 's' ? 1000 : 1)
    }
    return unit as number
}

export type Unit = {
    value: number;
    unit?: string;
}

export type UnitResolver = (index: number) => Unit | string | number

import { isDefined, isNumber } from './type'
import { _, measureExpression } from './resources'

export const stepNone = '='
export const stepForward = '+='
export const stepBackward = '-='

/**
 * Parses a string or number and returns the unit and numeric value
 */
export const parseUnit = (val: string | number, output?: Unit): Unit => {
  output = output || ({} as Unit)

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
export const convertToMs = (val: string | number) => {
  if (!isDefined(val) || isNumber(val)) {
    return val as number
  }
  const match = measureExpression.exec(val as string)
  const unit = match[2]
  return +match[1] * (unit === 's' ? 1000 : unit === 'm' ? 60000 : 1)
}

export type Unit = {
  value: number
  unit?: string
}

export type UnitResolver = (index: number) => Unit | string | number

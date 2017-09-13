import { isDefined } from '../lib/utils/inspect'
import { _, measureExpression } from '../lib/utils/constants'

export interface Unit {
  value: number | undefined
  unit: string
}

/**
 * Parses a string or number and returns the unit and numeric value
 */
export function parseUnit(val: string | number): Unit {
  const output: Unit = {
    unit: _,
    value: _
  }

  if (!isDefined(val)) {
    return output
  }
  if (Number(val)) {
    output.value = +val
    return output
  }

  const match = measureExpression.exec(val as string) as RegExpExecArray
  if (match) {
    output.unit = match[2] || _
    output.value = match[1] ? parseFloat(match[1]) : _
  }

  return output
}

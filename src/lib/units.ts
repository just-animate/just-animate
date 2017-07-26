import { isDefined, isNumber } from './inspect'
import { measureExpression } from './constants'

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

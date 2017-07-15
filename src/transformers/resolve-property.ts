import {
  AnimationTarget,
  KeyframeValueResolver,
  KeyframeFunction
} from '../types'
import { isFunction, isNumber, isDefined } from '../utils/type';
import { unitExpression } from '../utils/resources';

/**
 *  Resolves the property/value of an animation
 */
export function resolveProperty<T1>(
  input: KeyframeValueResolver,
  target: AnimationTarget,
  index?: number,
  isStep = false
): any {
  let output = isFunction(input)
    ? resolveProperty((input as KeyframeFunction)(target, index), target, index)
    : input as T1 | number | string

  if (isDefined(output) && !isNumber(output)) {
    const match = unitExpression.exec(
      (output as any) as string
    ) as RegExpExecArray
    if (match) {
      const stepTypeString = match[1]
      const startString = match[2]
      const unitTypeString = match[3]
      const num = startString ? parseFloat(startString) : 0
      const sign = stepTypeString === '-=' ? -1 : 1
      const step =
        isStep || (stepTypeString && isDefined(index)) ? (index || 0) + 1 : 1
      const val = sign * num * step
      return unitTypeString ? val + unitTypeString : val
    }
  }
  if (isNumber(output) && isStep) {
    return (output as number) * (index + 1)
  }
  return output
}

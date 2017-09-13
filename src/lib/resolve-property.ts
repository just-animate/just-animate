import { AnimationTarget, PropertyResolver, PropertyFunction } from './types'
import { isFunction } from './utils/inspect'

/**
 *  Resolves the property/value of an animation
 */
export function resolveProperty<T1>(
  input: PropertyResolver<T1>,
  target: AnimationTarget,
  index: number,
  len: number
): T1 {
  return isFunction(input)
    ? resolveProperty((input as PropertyFunction<T1>)(target, index, len), target, index, len)
    : input as T1
}

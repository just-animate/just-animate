import { AnimationTarget, KeyframeValueResolver, KeyframeFunction } from './types'
import { isFunction } from './inspect'

/**
 *  Resolves the property/value of an animation
 */
export function resolveProperty<T1>(input: KeyframeValueResolver<T1>, target: AnimationTarget, index?: number): T1 {
  return isFunction(input)
    ? resolveProperty((input as KeyframeFunction<T1>)(target, index), target, index)
    : input as T1
}

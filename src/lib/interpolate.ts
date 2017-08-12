import { cssFunction } from 'just-curves'
import { Keyframe } from './types'
import { isNumber } from './inspect'
// import { rnd } from './math';
import { memoize } from './functional'

function findEndIndex(ns: number[], n: number) {
  const ilen = ns.length
  for (let i = 0; i < ilen; i++) {
    if (ns[i] > n) {
      return i
    }
  }
  return ilen - 1
}

// const floatLimit = /^(\-?\d+\.?\d{0,5})/

// const getEasing = cssFunction
const getEasing = memoize(cssFunction)

/**
 * Fixes for dangling float decimals. Example: 0.00000000000005
 */
// function floatToString(value: number) {
//   return floatLimit.exec((rnd(value * 100000) / 100000).toString())![1]
// }

function integerInterpolator(l: number, r: number, o: number) {
  return l + (r - l) * o
}

function fallbackInterpolator(l: any, r: any, o: number) {
  return o < 0.5 ? l : r
}

type Interpolator<T> = (right: T, left: T, offset: number) => T

export function interpolator(duration: number, keyframes: Keyframe[]) {
  const times = keyframes.map(k => k.offset * duration)
  const values = keyframes.map(k => k.value)
  const easings = keyframes.map(k => getEasing(k.easing))
  const sampleValue = values[0]

  let fn: Interpolator<any>
  if (isNumber(sampleValue)) {
    fn = integerInterpolator
  } else {
    fn = fallbackInterpolator
  }

  return function(offset: number) {
    const time = duration * offset
    const r = findEndIndex(times, time)
    const l = r ? r - 1 : 0
    const rt = times[r]
    const lt = times[l]
    const localOffset = (time - lt) / (rt - lt)
    const relativeOffset = easings[l](localOffset)
    return fn(values[l], values[r], relativeOffset)
  }
}

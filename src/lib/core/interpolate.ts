import { cssFunction } from 'just-curves'
import { Keyframe, Interpolator } from './types'
import { isNumber, isFunction } from '../utils/inspect' 
import { memoize } from '../utils/functional'
import { all } from '../utils/lists'

function findEndIndex(ns: number[], n: number) {
  const ilen = ns.length
  for (let i = 0; i < ilen; i++) {
    if (ns[i] > n) {
      return i
    }
  }
  return ilen - 1
}

const getEasing = memoize(cssFunction)

// memoize all results of the function, also memoize the function itself
const getInterpolator = memoize((fn: Interpolator) => memoize(fn) as Interpolator)

export function interpolate(l: number, r: number, o: number) {
  return l + (r - l) * o
}

function fallbackInterpolator(l: any, r: any, o: number) {
  return o < 0.5 ? l : r
}

export function interpolator(duration: number, keyframes: Keyframe[]) {
  const times = keyframes.map(k => k.offset * duration)

  all(keyframes, k => {
    const isSimple = !isFunction(k.interpolate)
    k.simpleFn = isSimple
    k.interpolate = !isSimple
      ? getInterpolator(k.interpolate as Interpolator)
      : isNumber(k.value)
        ? interpolate
        : fallbackInterpolator
  })

  return function(timelineOffset: number) {
    const absTime = duration * timelineOffset
    const r = findEndIndex(times, absTime)
    const l = r ? r - 1 : 0
    const rt = times[r]
    const lt = times[l]
    const lk = keyframes[l]

    const time = (absTime - lt) / (rt - lt)
    const progression = lk.easing ? getEasing(lk.easing)(time) : time

    if (lk.simpleFn) {
      return lk.interpolate(lk.value, keyframes[r].value, progression)
    }
    return lk.interpolate(lk.value, keyframes[r].value)(progression)
  }
}

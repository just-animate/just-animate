import { cssFunction } from 'just-curves';
import { Keyframe, Interpolator } from './types';
import { isNumber, isFunction } from './inspect';
// import { rnd } from './math';
import { memoize } from './functional';

function findEndIndex(ns: number[], n: number) {
  const ilen = ns.length;
  for (let i = 0; i < ilen; i++) {
    if (ns[i] > n) {
      return i;
    }
  }
  return ilen - 1;
}
 
const getEasing = memoize(cssFunction);

// memoize all results of the function, also memoize the function itself
const getInterpolator = memoize((fn: Interpolator) => memoize(fn) as Interpolator)

export function interpolate(l: number, r: number, o: number) {
  return l + (r - l) * o;
}

function fallbackInterpolator(l: any, r: any, o: number) {
  return o < 0.5 ? l : r;
}

export function interpolator(duration: number, keyframes: Keyframe[]) {
  const times = keyframes.map(k => k.offset * duration);
  const values = keyframes.map(k => k.value);
  const easings = keyframes.map(k => getEasing(k.easing));
 
  const interpolators = keyframes.map(k => {
    if (isFunction(k.interpolate)) {
      return getInterpolator(k.interpolate)
    } else if (isNumber(k.value)) {
      return interpolate;
    } else {
      return fallbackInterpolator;
    } 
  });

  return function(offset: number) {
    const time = duration * offset;
    const r = findEndIndex(times, time);
    const l = r ? r - 1 : 0;
    const rt = times[r];
    const lt = times[l];
    const localOffset = (time - lt) / (rt - lt);
    const relativeOffset = easings[l](localOffset);
    return interpolators[l](values[l], values[r], relativeOffset);
  };
}

import { flr, rdm } from './math'

/**
 * Returns one of the supplied values at random
 * 
 * @template T
 * @param {T[]} choices from which to choose
 * @returns {T} a choice at random
 * 
 * @memberOf JustAnimate
 */
export function shuffle<T>(choices: T[]): T {
  return choices[flr(rdm() * choices.length)]
}

export function random(
  first: number,
  last: number,
  unit?: string,
  wholeNumbersOnly?: boolean
) {
  let val = first + rdm() * (last - first)
  if (wholeNumbersOnly === true) {
    val = flr(val)
  }
  return !unit ? val : val + unit
}

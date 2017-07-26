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
  return choices[Math.floor(Math.random() * choices.length)]
}

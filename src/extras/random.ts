const rdm = Math.random
const flr = Math.floor

/**
 * Returns a random number within the range
 * @param first number in the range
 * @param last number in the range
 * @param suffix to append to the number (px, em, %, etc.)
 * @param round if true, then round the result to the nearest whole number
 */
export function random(first: number, last: number, suffix?: string, round?: boolean) {
  let val = first + rdm() * (last - first)
  if (round === true) {
    val = flr(val)
  }
  return !suffix ? val : val + suffix
}

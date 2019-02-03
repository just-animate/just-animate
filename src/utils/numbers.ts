/**
 * A helper for numeric sort. The default JavaScript sort is alphanumeric,
 * which would sort 1,9,10 to 1,10,9.
 * @param a the first term to compare.
 * @param b the second term to compare.
 */
export function byNumber(a: number, b: number) {
  return a - b;
}

/**
 * Returns the min if the value is less than, the max if the value is greater
 * than, or the value if in between the min and max.
 * @param value The value to clamp.
 * @param min The minimum value to return.
 * @param max The maximum value to return.
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Finds the index before the provided value in the list of numbers.
 * @param list The list to search.
 * @param value The value to reference.
 */
export function findUpperIndex(list: number[], value: number) {
  let i = 0;
  while (i < list.length) {
    if (list[i] >= value) {
      break;
    }
    i++;
  }
  return i;
}

/**
 * Returns true if the string or nunmber is numeric.
 * @param obj to test for numbers
 */
export function isNumeric(obj: number | string): boolean {
  return typeof obj === 'number' || isFinite(+obj);
}

/**
 * Coerces a number string into a number;
 * @param str the string to coerce.
 */
export function toNumber(str: string) {
  return +str;
}

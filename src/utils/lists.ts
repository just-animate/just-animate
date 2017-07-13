import { isArrayLike } from './type'
import { _ } from '.'

const slice = Array.prototype.slice

export interface IList<T> {
  [key: number]: T
  length: number
}

export const includes = <T>(items: T[], item: T) => items.indexOf(item) !== -1

/**
 * Returns the first object in the list or undefined
 */
export const head = <T>(
  indexed: IList<T>,
  predicate?: { (t: T): boolean }
): T => {
  if (!indexed || indexed.length < 1) {
    return _
  }
  if (predicate === _) {
    return indexed[0]
  }
  for (const item of indexed as T[]) {
    if (predicate(item)) {
      return item
    }
  }
  return _
}

/**
 * Returns the last object in the list or undefined
 */
export const tail = <T>(
  indexed: IList<T>,
  predicate?: { (t: T): boolean }
): T => {
  if (!indexed || indexed.length < 1) {
    return _
  }
  if (predicate === _) {
    return indexed[indexed.length - 1]
  }
  for (const item of indexed as T[]) {
    if (predicate(item)) {
      return item
    }
  }
  return _
}

/**
 * Returns the index of the first matching item or -1
 */
export const indexOf = <T>(items: T[], predicate: { (t: T): boolean }) => {
  for (let i = 0, ilen = items.length; i < ilen; i++) {
    const item = items[i]
    if (predicate(item)) {
      return i
    }
  }
  return -1
}

export function sortBy<T>(fieldName: keyof T) {
  return (a: T, b: T) => {
    const a1 = a[fieldName],
      b1 = b[fieldName]
    return a1 < b1 ? -1 : a1 > b1 ? 1 : 0
  }
}

/**
 * Converts list to an Array.
 * Useful for converting NodeList and arguments to []
 * 
 * @export
 * @template T
 * @param {T[]} list to convert
 * @returns {T[]} array clone of list
 */
export const toArray = <T>(indexed: IList<T>, index?: number): T[] =>
  slice.call(indexed, index || 0)

/**
 * returns an array or an object wrapped in an array
 * 
 * @export
 * @template T
 * @param {(IList<T> | T)} indexed
 * @returns {T[]}
 */
export const listify = <T>(indexed: IList<T> | T): T[] => {
  return isArrayLike(indexed) ? indexed as T[] : [indexed as T]
}

/**
 * Returns the max value of a given property in a list
 * 
 * @export
 * @template T1
 * @param {T1[]} items list of objects
 * @param {string} propertyName property to evaluate
 * @returns {*} max value of the property provided
 */

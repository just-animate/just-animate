import { Mapper } from '../types'
import { isArray } from './type'
import { _ } from '.'

const slice = Array.prototype.slice

export interface IList<T> {
    [key: number]: T
    length: number
}

/**
 * Returns the first object in the list or undefined
 */
export const head = <T>(indexed: IList<T>, predicate?: { (t: T): boolean; }): T => {
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
export const tail = <T>(indexed: IList<T>, predicate?: { (t: T): boolean; }): T => {
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
 * Converts list to an Array.
 * Useful for converting NodeList and arguments to []
 * 
 * @export
 * @template T
 * @param {T[]} list to convert
 * @returns {T[]} array clone of list
 */
export const toArray = <T>(indexed: IList<T>, index?: number): T[] => slice.call(indexed, index || 0)

/**
 * returns an array or an object wrapped in an array
 * 
 * @export
 * @template T
 * @param {(IList<T> | T)} indexed
 * @returns {T[]}
 */
export const listify = <T>(indexed: IList<T> | T): T[] => {
    return isArray(indexed) ? indexed as T[] : [indexed as T]
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
export const maxBy = <T1, T2>(items: T1[], predicate: Mapper<T1, T2>): T2 => {
    let max: any = ''
    for (const item of items) {
        const prop = predicate(item)
        if (max < prop) {
            max = prop
        }
    }
    return max
}

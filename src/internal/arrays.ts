import { OneOrMany } from '../types'
import { isArrayLike, isDefined } from './inspect'
import { _ } from './constants'

export function addAll<T>(target: T[], subarray: T[]): void {
    target.push.apply(target, subarray)
}

export function removeAll<T>(target: T[], subarray: T[]): void {
    for (let i = 0; i < subarray.length; i++) {
        const index = target.indexOf(subarray[i])
        if (index !== -1) {
            target.splice(index, 1)
        }
    }
}

export function toArray<T>(t: OneOrMany<T>): T[] {
    return Array.isArray(t) ? (t as T[]) : [t as T]
}

export interface IList<T> {
    [key: number]: T
    length: number
}

export function includes<T>(items: T[], item: T) {
    return getIndex(items, item) !== -1
}

export function getIndex<T>(items: T[], item: T) {
    return items.indexOf(item)
}

/**
 * Returns the first object in the list or undefined
 */
export function find<T>(indexed: IList<T>, predicate?: { (t: T): boolean }): T {
    const ilen = indexed && indexed.length
    if (!ilen) {
        return _
    }
    if (predicate === _) {
        return indexed[0]
    }

    for (let i = 0; i < ilen; i++) {
        if (predicate(indexed[i])) {
            return indexed[i]
        }
    }

    return _
}

/**
 * Returns the index of the first matching item or -1
 */
export function indexOf<T>(items: T[], predicate: { (t: T): boolean }) {
    for (var i = 0, ilen = items.length; i < ilen; i++) {
        var item = items[i]
        if (predicate(item)) {
            return i
        }
    }
    return -1
}

export function remove<T>(items: T[], item: T) {
    const index = items.indexOf(item)
    return index !== -1 ? items.splice(index, 1) : _
}

export function sortBy<T>(fieldName: keyof T) {
    return (a: T, b: T) => {
        const a1 = a[fieldName]
        const b1 = b[fieldName]
        return a1 < b1 ? -1 : a1 > b1 ? 1 : 0
    }
}

/**
 * Returns an array if already an array or an object wrapped in an array
 *
 * @export
 * @template T
 * @param {(IList<T> | T)} indexed
 * @returns {T[]}
 */
export function list<T>(indexed: IList<T> | T): T[] {
    return !isDefined(indexed) ? [] : isArrayLike(indexed) ? (indexed as T[]) : [indexed as T]
}

/**
 *
 * @param indexed
 * @param item
 */
export function push<T>(indexed: T[], item: T): T {
    if (item !== _) {
        Array.prototype.push.call(indexed, item)
    }
    return item
}

export function pushDistinct<T>(indexed: T[], item: T): T {
    if (!includes(indexed, item)) {
        push(indexed, item)
    }
    return item
}

export function mapFlatten<TInput, TOutput>(items: TInput[], mapper: (input: TInput) => TOutput | TOutput[]) {
    var results: TOutput[] = []
    all(items, item => {
        var result = mapper(item)
        if (isArrayLike(result)) {
            all(result as TOutput[], item2 => push(results, item2))
        } else {
            push(results, result as TOutput)
        }
    })
    return results
}

export type Action<T1> = (input: T1, index: number, len: number) => void

/**
 * iterates over all items until [false] is returned or it runs out of items
 * @param items array-like object to iterate
 * @param action function to perform for each item
 * @param reverse if true, items start from the end and go to the beginning
 */
export function all<T1>(items: T1 | IList<T1>, action: Action<T1>): void {
    const items2 = list(items)
    for (let i = 0, ilen = items2.length; i < ilen; i++) {
        action(items2[i], i, ilen)
    }
}

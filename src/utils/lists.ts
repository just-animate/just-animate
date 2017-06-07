import { isArray } from './type';

const slice = Array.prototype.slice;

export interface IList<T> {
    [key: number]: T;
    length: number;
}

/**
 * Returns the first object in the list or undefined
 */
export const head = <T>(indexed: IList<T>, predicate?: { (t: T): boolean; }): T | undefined => {
    if (!indexed || indexed.length < 1) {
        return undefined;
    }
    if (predicate === undefined) {
        return indexed[0];
    }
    for (const item of indexed as T[]) {
        if (predicate(item)) {
            return item;
        }
    }
    return undefined;
};

/**
 * Returns the last object in the list or undefined
 */
export const tail = <T>(indexed: IList<T>, predicate?: { (t: T): boolean; }): T | undefined => {
    if (!indexed || indexed.length < 1) {
        return undefined;
    }
    if (predicate === undefined) {
        return indexed[indexed.length - 1];
    }
    for (const item of indexed as T[]) {
        if (predicate(item)) {
            return item;
        }
    }
    return undefined;
};

/**
 * Converts list to an Array.
 * Useful for converting NodeList and arguments to []
 * 
 * @export
 * @template T
 * @param {T[]} list to convert
 * @returns {T[]} array clone of list
 */
export const toArray = <T>(indexed: IList<T>, index?: number): T[] => slice.call(indexed, index || 0);

/**
 * returns an array or an object wrapped in an array
 * 
 * @export
 * @template T
 * @param {(IList<T> | T)} indexed
 * @returns {T[]}
 */
export const chain = <T>(indexed: IList<T> | T): T[] => {
    return isArray(indexed) ? indexed as T[] : [indexed as T];
};

/**
 * Returns the max value of a given property in a list
 * 
 * @export
 * @template T1
 * @param {T1[]} items list of objects
 * @param {string} propertyName property to evaluate
 * @returns {*} max value of the property provided
 */
export const maxBy = <T1, T2>(items: T1[], predicate: ja.Mapper<T1, T2>): T2 => {
    let max: any = '';
    for (const item of items) {
        const prop = predicate(item);
        if (max < prop) {
            max = prop;
        }
    }
    return max;
};

import { nil } from './resources';
import { isArray } from './type';

const slice = Array.prototype.slice;
const push = Array.prototype.push;

export interface IList<T> {
    [key: number]: T;
    length: number;
};

/**
 * Returns the first object in the list or undefined
 */
export function head<T>(indexed: IList<T>, predicate?: { (t: T): boolean; }): T {
    if (!indexed) {
        return nil;
    }

    const len = indexed.length;
    if (len < 1) {
        return nil;
    }
    if (predicate === nil) {
        return indexed[0];
    }
    for (let i = 0; i < len; i++) {
        const item = indexed[i];
        const result = predicate(item);
        if (result === true) {
            return item;
        }
    }

    return nil;
}
/**
 * Returns the last object in the list or undefined
 */
export function tail<T>(indexed: IList<T>, predicate?: { (t: T): boolean; }): T {
    if (!indexed) {
        return nil;
    }

    const len = indexed.length;
    if (len < 1) {
        return nil;
    }
    if (predicate === nil) {
        return indexed[len - 1];
    }
    for (let i = len - 1; i > -1; --i) {
        const item = indexed[i];
        const result = predicate(item);
        if (result === true) {
            return item;
        }
    }

    return nil;
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
export function toArray<T>(indexed: IList<T>, index?: number): T[] {
    return slice.call(indexed, index || 0);
}

/**
 * returns an array or an object wrapped in an array
 * 
 * @export
 * @template T
 * @param {(IList<T> | T)} indexed
 * @returns {T[]}
 */
export function chain<T>(indexed: IList<T> | T): T[] {
    return isArray(indexed) ? indexed as T[] : [indexed as T];
}

/**
 * Performs the function against all objects in the list
 * 
 * @export
 * @template T1
 * @param {T[]} items list of objects
 * @param {ja.IConsumer<T1>} fn function to execute for each object
 */
export function each<T1>(items: T1[], fn: { (c: T1): any }): void {
    for (let i = 0, len = items.length; i < len; i++) {
        fn(items[i]);
    }
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
export function max<T1>(items: T1[], propertyName: string): any {
    let max: any = '';
    for (let i = 0, len = items.length; i < len; i++) {
        const item = items[i] as any;
        const prop = item[propertyName] as any;
        if (max < prop) {
            max = prop;
        }
    }
    return max;
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
export function maxBy<T1, T2>(items: T1[], predicate: ja.Mapper<T1, T2>): T2 {
    let max: any = '';
    for (let i = 0, len = items.length; i < len; i++) {
        const item = items[i] as any;
        const prop = predicate(item);
        if (max < prop) {
            max = prop;
        }
    }
    return max;
}

/**
 * Maps one list of objects to another.
 * Returning undefined skips the item (effectively filtering it)
 * 
 * @export
 * @template T1
 * @template T2
 * @param {T1[]} items list of objects to map
 * @param {ja.IMapper<T1, T2>} fn function that maps each object
 * @returns {T2[]} new list of objects
 */
export function map<T1, T2>(items: IList<T1>, fn: ja.Mapper<T1, T2>): T2[] {
    const results = [] as T2[];
    for (let i = 0, len = items.length; i < len; i++) {
        const result = fn(items[i]);
        if (result !== nil) {
            results.push(result);
        }
    }
    return results;
}

/**
 * Pushes each item in target into source and returns source
 * 
 * @export
 * @template T
 * @param {T[]} source
 * @param {T[]} target
 */
export function pushAll<T>(source: T[], target: T[]): void {
    push.apply(source, target);
}

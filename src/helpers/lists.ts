import {isFunction} from './type';
const slice = Array.prototype.slice;


/**
 * Returns the first object in the list or undefined
 * 
 * @export
 * @template T
 * @param {ja.IIndexed<T>} indexed list of objects
 * @returns {T} first object in the list or undefined
 */
export function head<T>(indexed: ja.IIndexed<T>): T {
    return (!indexed || indexed.length < 1) ? undefined : indexed[0];
}
/**
 * Returns the last object in the list or undefined
 * 
 * @export
 * @template T
 * @param {ja.IIndexed<T>} indexed list of objects
 * @returns {T} last object in the list or undefined
 */
export function tail<T>(indexed: ja.IIndexed<T>): T {
    return (!indexed || indexed.length < 1) ? undefined : indexed[indexed.length - 1];
}


/**
 * Converts list to an Array.
 * Useful for converting NodeList and arguments to []
 * 
 * @export
 * @template T
 * @param {ja.IIndexed<T>} list to convert
 * @returns {T[]} array clone of list
 */
export function toArray<T>(indexed: ja.IIndexed<T>): T[] {
    return slice.call(indexed, 0);
}

/**
 * Performs the function against all objects in the list
 * 
 * @export
 * @template T1
 * @param {ja.IIndexed<T1>} items list of objects
 * @param {ja.IConsumer<T1>} fn function to execute for each object
 */
export function each<T1>(items: ja.IIndexed<T1>, fn: ja.IConsumer<T1>): void {
    for (let i = 0, len = items.length; i < len; i++) {
        fn(items[i]);
    }
}

/**
 * Returns the max value of a given property in a list
 * 
 * @export
 * @template T1
 * @param {ja.IIndexed<T1>} items list of objects
 * @param {string} propertyName property to evaluate
 * @returns {*} max value of the property provided
 */
export function max<T1>(items: ja.IIndexed<T1>, propertyName: string): any {
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
 * Maps one list of objects to another.
 * Returning undefined skips the item (effectively filtering it)
 * 
 * @export
 * @template T1
 * @template T2
 * @param {ja.IIndexed<T1>} items list of objects to map
 * @param {ja.IMapper<T1, T2>} fn function that maps each object
 * @returns {T2[]} new list of objects
 */
export function map<T1, T2>(items: ja.IIndexed<T1>, fn: ja.IMapper<T1, T2>): T2[] {
    const results = [] as T2[];
    for (let i = 0, len = items.length; i < len; i++) {
        const result = fn(items[i]);
        if (result !== undefined) {
            results.push(result);
        }
    }
    return results;
}

const slice = Array.prototype.slice;
const push = Array.prototype.push;

export interface IList<T> { 
    [key: number]: T; 
    length: number; 
};

/**
 * Returns the first object in the list or undefined
 * 
 * @export
 * @template T
 * @param {T[]} indexed list of objects
 * @returns {T} first object in the list or undefined
 */
export function head<T>(indexed: IList<T>): T {
    return (!indexed || indexed.length < 1) ? undefined : indexed[0];
}
/**
 * Returns the last object in the list or undefined
 * 
 * @export
 * @template T
 * @param {T[]} indexed list of objects
 * @returns {T} last object in the list or undefined
 */
export function tail<T>(indexed: IList<T>): T {
    return (!indexed || indexed.length < 1) ? undefined : indexed[indexed.length - 1];
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
export function toArray<T>(indexed: IList<T>): T[] {
    return slice.call(indexed, 0);
}

/**
 * Performs the function against all objects in the list
 * 
 * @export
 * @template T1
 * @param {T[]} items list of objects
 * @param {ja.IConsumer<T1>} fn function to execute for each object
 */
export function each<T1>(items: T1[], fn: ja.IConsumer<T1>): void {
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
export function maxBy<T1, T2>(items: T1[], predicate: ja.IMapper<T1, T2>): T2 {
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
export function map<T1, T2>(items: IList<T1>, fn: ja.IMapper<T1, T2>): T2[] {
    const results = [] as T2[];
    for (let i = 0, len = items.length; i < len; i++) {
        const result = fn(items[i]);
        if (result !== undefined) {
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
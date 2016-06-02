/// <reference path="../just-animate.d.ts" />

const ostring = Object.prototype.toString;
const slice = Array.prototype.slice;

/**
 * No operation function: a placeholder
 * 
 * @export
 */
export function noop(): void {
    // do nothing
}

/**
 * Clamps a number between the min and max
 * 
 * @export
 * @param {number} val number to clamp
 * @param {number} min min number allowed
 * @param {number} max max number allowed
 * @returns {number} val if between min-max, min if lesser, max if greater
 */
export function clamp(val: number, min: number, max: number): number {
    return val === undefined ? undefined : val < min ? min : val > max ? max : val;
}

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
 * Tests if object is a list
 * 
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if is not a string and length property is a number
 */
export function isArray(a: any): boolean {
    return !isString(a) && isNumber(a.length);
}

/**
 * Tests if object is a function
 * 
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if object.toString reports it as a Function
 */
export function isFunction(a: any): boolean {
    return ostring.call(a) === '[object Function]';
}

/**
 * Tests if object is a number
 * 
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if the object is typeof number
 */
export function isNumber(a: any): boolean {
    return typeof a === 'number';
}

/**
 * Tests if object is a string
 * 
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if object is typeof string
 */
export function isString(a: any): boolean {
    return typeof a === 'string';
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

/**
 * Extends the first object with the properties of each subsequent object
 * 
 * @export
 * @param {*} target object to extend
 * @param {...any[]} sources sources from which to inherit properties
 * @returns {*} first object
 */
export function extend(target: any, ...sources: any[]): any {
    for (let i = 1, len = arguments.length; i < len; i++) {
        const source = arguments[i];
        for (let propName in source) {
            target[propName] = source[propName];
        }
    }
    return target;
}

/**
 * Calls the named function for each object in the list
 * 
 * @export
 * @param {ja.IIndexed<any>} targets list of objects on which to call a function
 * @param {string} fnName function name to call on each object
 * @param {ja.IIndexed<any>} args list of arguments to pass to the function
 * @param {ja.ICallbackHandler} [cb] optional error handlers
 * @returns {any[]} all results as an array
 */
export function multiapply(targets: ja.IIndexed<any>, fnName: string, args: ja.IIndexed<any>, cb?: ja.ICallbackHandler): any[] {
    const errors = [] as any[];
    const results = [] as any[];
    for (let i = 0, len = targets.length; i < len; i++) {
        try {
            const target = targets[i];
            let result: any;
            if (fnName) {
                result = target[fnName].apply(target, args);
            } else {
                result = target.apply(undefined, args);
            }
            if (result !== undefined) {
                results.push(result);
            }
        } catch (err) {
            errors.push(err);
        }
    }
    if (isFunction(cb)) {
        cb(errors);
    }
    return results;
}

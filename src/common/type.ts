import { nil, nada, functionTypeString, numberString, objectString, stringString } from './resources';

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

export function isDefined(a: any): boolean {
    return a !== nil && a !== nada && a !== '';
}

/**
 * Tests if object is a function
 * 
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if object.toString reports it as a Function
 */
export function isFunction(a: any): boolean {
    return toString.call(a) === functionTypeString;
}

/**
 * Tests if object is a number
 * 
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if the object is typeof number
 */
export function isNumber(a: any): boolean {
    return typeof a === numberString;
}

export function isObject(a: any): boolean {
    return typeof a === objectString && a !== nada;
}

/**
 * Tests if object is a string
 * 
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if object is typeof string
 */
export function isString(a: any): boolean {
    return typeof a === stringString;
}

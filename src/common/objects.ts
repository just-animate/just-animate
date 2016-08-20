import { isDefined, isFunction, isObject } from './type';

/**
 * Extends the first object with the properties of each subsequent object
 * 
 * @export
 * @param {*} target object to extend
 * @param {...any[]} sources sources from which to inherit properties
 * @returns {*} first object
 */
export const extend: Function = function(): any {
    const args = arguments;
    const target = args[0];
    for (let i = 1, len = args.length; i < len; i++) {
        const source = args[i];
        for (let propName in source) {
            target[propName] = source[propName];
        }
    }
    return target;
};

export const inherit: Function = function(): any {
    const args = arguments;
    const target = args[0];
    for (let i = 1, len = args.length; i < len; i++) {
        const source = args[i];
        for (let propName in source) {
            if (!isDefined(target[propName])) {
                target[propName] = source[propName];
            }
        }
    }
    return target;
};

export const expand: Function = function(expandable: any): any {
    const result = {};
    for (let prop in expandable) {
        let propVal = expandable[prop];
        if (isFunction(propVal)) {
            propVal = propVal();
        } else if (isObject(propVal)) {
            propVal = expand(propVal);
        }
        result[prop] = propVal;
    }
    return result;
};

export function unwrap<T>(value: T | ja.IProvider<T>): T {
    if (isFunction(value)) {
        return (value as ja.IProvider<T>)();
    }
    return value as T;
}

export const isDefined = (a: any): boolean => {
    return !!a || a === 0 || a === false;
};

/**
 * Calls the native object.toString for real type comparisons
 */
export const getTypeString = (val: any): string => {
    return Object.prototype.toString.call(val);
};

/**
 * Tests if object is a function
 */
export const isFunction = (a: any): boolean => {
    return getTypeString(a) === '[object Function]';
};

export const isNumber = (a: any) => typeof a === 'number';
export const isObject = (a: any) => typeof a === 'object' && !!a;
export const isString = (a: any) => typeof a === 'string';

/**
 * Tests if object is an array
 */
export const isArray = (a: any): boolean => {
    return isDefined(a) && !isString(a) && !isFunction(a) && isNumber(a.length);
};

/**
 * Returns true if the target appears to be an element.  This helper is looking for a value tagName
 * This is more useful than doing instanceof Element since WAAPI should support virtual elements
 */
export const isElement = (target: Element | {}): boolean => {
    return !!target && typeof target['tagName'] === 'string';
};

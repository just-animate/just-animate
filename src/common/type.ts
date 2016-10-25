/**
 * Tests if object is an array
 */
export function isArray(a: any): boolean {
    return isDefined(a) && !isString(a) && !isFunction(a) && isNumber(a.length);
}

export function isDefined(a: any): boolean {
    return !!a || a === 0 || a === false;
}

/**
 * Returns true if the target appears to be an element.  This helper is looking for a value tagName
 * This is more useful than doing instanceof Element since WAAPI should support virtual elements
 */
export function isElement(target: Element | {}): boolean {
    return !!target && typeof target['tagName'] === 'string';
}

/**
 * Tests if object is a function
 */
export function isFunction(a: any): boolean {
    return getTypeString(a) === '[object Function]';
}

/**
 * Tests if object is a number
 */
export function isNumber(a: any): boolean {
    return typeof a === 'number';
}

export function isObject(a: any): boolean {
    return typeof a === 'object' && !!a;
}

/**
 * Tests if object is a string
 */
export function isString(a: any): boolean {
    return typeof a === 'string';
}

/**
 * Calls the native object.toString for real type comparisons
 */
export function getTypeString(val: any): string {
    return Object.prototype.toString.call(val);
}

/// <reference path="../just-animate.d.ts" />
"use strict";
var ostring = Object.prototype.toString;
var slice = Array.prototype.slice;
/**
 * No operation function: a placeholder
 *
 * @export
 */
function noop() {
    // do nothing
}
exports.noop = noop;
/**
 * Clamps a number between the min and max
 *
 * @export
 * @param {number} val number to clamp
 * @param {number} min min number allowed
 * @param {number} max max number allowed
 * @returns {number} val if between min-max, min if lesser, max if greater
 */
function clamp(val, min, max) {
    return val === undefined ? undefined : val < min ? min : val > max ? max : val;
}
exports.clamp = clamp;
/**
 * Returns the first object in the list or undefined
 *
 * @export
 * @template T
 * @param {ja.IIndexed<T>} indexed list of objects
 * @returns {T} first object in the list or undefined
 */
function head(indexed) {
    return (!indexed || indexed.length < 1) ? undefined : indexed[0];
}
exports.head = head;
/**
 * Returns the last object in the list or undefined
 *
 * @export
 * @template T
 * @param {ja.IIndexed<T>} indexed list of objects
 * @returns {T} last object in the list or undefined
 */
function tail(indexed) {
    return (!indexed || indexed.length < 1) ? undefined : indexed[indexed.length - 1];
}
exports.tail = tail;
/**
 * Tests if object is a list
 *
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if is not a string and length property is a number
 */
function isArray(a) {
    return !isString(a) && isNumber(a.length);
}
exports.isArray = isArray;
/**
 * Tests if object is a function
 *
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if object.toString reports it as a Function
 */
function isFunction(a) {
    return ostring.call(a) === '[object Function]';
}
exports.isFunction = isFunction;
/**
 * Tests if object is a number
 *
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if the object is typeof number
 */
function isNumber(a) {
    return typeof a === 'number';
}
exports.isNumber = isNumber;
/**
 * Tests if object is a string
 *
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if object is typeof string
 */
function isString(a) {
    return typeof a === 'string';
}
exports.isString = isString;
/**
 * Converts list to an Array.
 * Useful for converting NodeList and arguments to []
 *
 * @export
 * @template T
 * @param {ja.IIndexed<T>} list to convert
 * @returns {T[]} array clone of list
 */
function toArray(indexed) {
    return slice.call(indexed, 0);
}
exports.toArray = toArray;
/**
 * Performs the function against all objects in the list
 *
 * @export
 * @template T1
 * @param {ja.IIndexed<T1>} items list of objects
 * @param {ja.IConsumer<T1>} fn function to execute for each object
 */
function each(items, fn) {
    for (var i = 0, len = items.length; i < len; i++) {
        fn(items[i]);
    }
}
exports.each = each;
/**
 * Returns the max value of a given property in a list
 *
 * @export
 * @template T1
 * @param {ja.IIndexed<T1>} items list of objects
 * @param {string} propertyName property to evaluate
 * @returns {*} max value of the property provided
 */
function max(items, propertyName) {
    var max = '';
    for (var i = 0, len = items.length; i < len; i++) {
        var item = items[i];
        var prop = item[propertyName];
        if (max < prop) {
            max = prop;
        }
    }
    return max;
}
exports.max = max;
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
function map(items, fn) {
    var results = [];
    for (var i = 0, len = items.length; i < len; i++) {
        var result = fn(items[i]);
        if (result !== undefined) {
            results.push(result);
        }
    }
    return results;
}
exports.map = map;
/**
 * Extends the first object with the properties of each subsequent object
 *
 * @export
 * @param {*} target object to extend
 * @param {...any[]} sources sources from which to inherit properties
 * @returns {*} first object
 */
function extend(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    for (var i = 1, len = arguments.length; i < len; i++) {
        var source = arguments[i];
        for (var propName in source) {
            target[propName] = source[propName];
        }
    }
    return target;
}
exports.extend = extend;
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
function multiapply(targets, fnName, args, cb) {
    var errors = [];
    var results = [];
    for (var i = 0, len = targets.length; i < len; i++) {
        try {
            var target = targets[i];
            var result = void 0;
            if (fnName) {
                result = target[fnName].apply(target, args);
            }
            else {
                result = target.apply(undefined, args);
            }
            if (result !== undefined) {
                results.push(result);
            }
        }
        catch (err) {
            errors.push(err);
        }
    }
    if (isFunction(cb)) {
        cb(errors);
    }
    return results;
}
exports.multiapply = multiapply;

"use strict";
var type_1 = require('./type');
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
    if (type_1.isFunction(cb)) {
        cb(errors);
    }
    return results;
}
exports.multiapply = multiapply;

"use strict";
var slice = Array.prototype.slice;
var push = Array.prototype.push;
;
/**
 * Returns the first object in the list or undefined
 *
 * @export
 * @template T
 * @param {T[]} indexed list of objects
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
 * @param {T[]} indexed list of objects
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
 * @param {T[]} list to convert
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
 * @param {T[]} items list of objects
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
 * @param {T1[]} items list of objects
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
 * @param {T1[]} items list of objects to map
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
function pushAll(source, target) {
    push.apply(source, target);
}
exports.pushAll = pushAll;

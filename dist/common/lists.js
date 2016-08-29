"use strict";
var resources_1 = require('./resources');
var slice = Array.prototype.slice;
var push = Array.prototype.push;
;
/**
 * Returns the first object in the list or undefined
 */
function head(indexed, predicate) {
    if (!indexed) {
        return resources_1.nil;
    }
    var len = indexed.length;
    if (len < 1) {
        return resources_1.nil;
    }
    if (predicate === resources_1.nil) {
        return indexed[0];
    }
    for (var i = 0; i < len; i++) {
        var item = indexed[i];
        var result = predicate(item);
        if (result === true) {
            return item;
        }
    }
    return resources_1.nil;
}
exports.head = head;
/**
 * Returns the last object in the list or undefined
 */
function tail(indexed, predicate) {
    if (!indexed) {
        return resources_1.nil;
    }
    var len = indexed.length;
    if (len < 1) {
        return resources_1.nil;
    }
    if (predicate === resources_1.nil) {
        return indexed[len - 1];
    }
    for (var i = len - 1; i > -1; --i) {
        var item = indexed[i];
        var result = predicate(item);
        if (result === true) {
            return item;
        }
    }
    return resources_1.nil;
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
function toArray(indexed, index) {
    return slice.call(indexed, index || 0);
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
 * Returns the max value of a given property in a list
 *
 * @export
 * @template T1
 * @param {T1[]} items list of objects
 * @param {string} propertyName property to evaluate
 * @returns {*} max value of the property provided
 */
function maxBy(items, predicate) {
    var max = '';
    for (var i = 0, len = items.length; i < len; i++) {
        var item = items[i];
        var prop = predicate(item);
        if (max < prop) {
            max = prop;
        }
    }
    return max;
}
exports.maxBy = maxBy;
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
        if (result !== resources_1.nil) {
            results.push(result);
        }
    }
    return results;
}
exports.map = map;
/**
 * Pushes each item in target into source and returns source
 *
 * @export
 * @template T
 * @param {T[]} source
 * @param {T[]} target
 */
function pushAll(source, target) {
    push.apply(source, target);
}
exports.pushAll = pushAll;

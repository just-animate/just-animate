"use strict";
var resources_1 = require("./resources");
var type_1 = require("./type");
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
    for (var _i = 0, _a = indexed; _i < _a.length; _i++) {
        var item = _a[_i];
        if (predicate(item)) {
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
    for (var _i = 0, _a = indexed; _i < _a.length; _i++) {
        var item = _a[_i];
        if (predicate(item)) {
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
 * returns an array or an object wrapped in an array
 *
 * @export
 * @template T
 * @param {(IList<T> | T)} indexed
 * @returns {T[]}
 */
function chain(indexed) {
    return type_1.isArray(indexed) ? indexed : [indexed];
}
exports.chain = chain;
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
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
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
    for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
        var item = items_2[_i];
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
 * @param {ja.IMapper<T1, T2>} fn function that maps all objects
 * @returns {T2[]} new list of objects
 */
function map(items, fn) {
    var results = [];
    for (var _i = 0, _a = items; _i < _a.length; _i++) {
        var item = _a[_i];
        var result = fn(item);
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

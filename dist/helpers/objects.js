"use strict";
var type_1 = require('./type');
/**
 * Extends the first object with the properties of each subsequent object
 *
 * @export
 * @param {*} target object to extend
 * @param {...any[]} sources sources from which to inherit properties
 * @returns {*} first object
 */
exports.extend = function () {
    var args = arguments;
    var target = args[0];
    for (var i = 1, len = args.length; i < len; i++) {
        var source = args[i];
        for (var propName in source) {
            target[propName] = source[propName];
        }
    }
    return target;
};
exports.inherit = function () {
    var args = arguments;
    var target = args[0];
    for (var i = 1, len = args.length; i < len; i++) {
        var source = args[i];
        for (var propName in source) {
            if (!type_1.isDefined(target[propName])) {
                target[propName] = source[propName];
            }
        }
    }
    return target;
};
exports.expand = function (expandable) {
    var result = {};
    for (var prop in expandable) {
        var propVal = expandable[prop];
        if (type_1.isFunction(propVal)) {
            propVal = propVal();
        }
        else if (type_1.isObject(propVal)) {
            propVal = exports.expand(propVal);
        }
        result[prop] = propVal;
    }
    return result;
};
function unwrap(value) {
    if (type_1.isFunction(value)) {
        return value();
    }
    return value;
}
exports.unwrap = unwrap;
;

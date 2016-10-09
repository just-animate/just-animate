"use strict";
var type_1 = require("./type");
var resources_1 = require("./resources");
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
function deepCopyObject(origin, dest) {
    dest = dest || {};
    for (var prop in origin) {
        deepCopyProperty(prop, origin, dest);
    }
    return dest;
}
exports.deepCopyObject = deepCopyObject;
function deepCopyProperty(prop, origin, dest) {
    var originProp = origin[prop];
    var destProp = dest[prop];
    // if the source and target don't have the same type, replace with target
    var originType = type_1.getTypeString(originProp);
    var destType = type_1.getTypeString(destProp);
    if (originType !== destType) {
        destProp = resources_1.nil;
    }
    if (type_1.isArray(originProp)) {
        // note: a compromise until a solution for merging arrays becomes clear
        dest[prop] = originProp.slice(0);
    }
    else if (type_1.isObject(originProp)) {
        dest[prop] = deepCopyObject(originProp, destProp);
    }
    else {
        dest[prop] = originProp;
    }
}
exports.deepCopyProperty = deepCopyProperty;
function inherit(target, source) {
    for (var propName in source) {
        if (!type_1.isDefined(target[propName])) {
            target[propName] = source[propName];
        }
    }
    return target;
}
exports.inherit = inherit;
;
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
function resolve(value, ctx) {
    if (!type_1.isFunction(value)) {
        return value;
    }
    return value(ctx.target, ctx.index, ctx.targets);
}
exports.resolve = resolve;
function listProps(indexed) {
    var props = [];
    var len = indexed.length;
    for (var i = 0; i < len; i++) {
        var item = indexed[i];
        for (var property in item) {
            if (props.indexOf(property) === -1) {
                props.push(property);
            }
        }
    }
    return props;
}
exports.listProps = listProps;

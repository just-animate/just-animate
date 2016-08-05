"use strict";
var type_1 = require('./type');
var lists_1 = require('./lists');
var camelCaseRegex = /([a-z])[- ]([a-z])/ig;
function camelCaseReplacer(match, p1, p2) {
    return p1 + p2.toUpperCase();
}
function toCamelCase(value) {
    return type_1.isString(value) ? value.replace(camelCaseRegex, camelCaseReplacer) : undefined;
}
exports.toCamelCase = toCamelCase;
exports.cssFunction = function () {
    var args = arguments;
    return args[0] + "(" + lists_1.toArray(args, 1).join(',') + ")";
};

"use strict";
var type_1 = require('./type');
var camelCaseRegex = /([a-z])[- ]([a-z])/ig;
function camelCaseReplacer(match, p1, p2) {
    return p1 + p2.toUpperCase();
}
function toCamelCase(value) {
    return type_1.isString(value) ? value.replace(camelCaseRegex, camelCaseReplacer) : undefined;
}
exports.toCamelCase = toCamelCase;

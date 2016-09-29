"use strict";
var resources_1 = require("./resources");
var ostring = Object.prototype.toString;
/**
 * Tests if object is a list
 *
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if is not a string and length property is a number
 */
function isArray(a) {
    return isDefined(a) && !isString(a) && isNumber(a.length);
}
exports.isArray = isArray;
function isDefined(a) {
    return a !== resources_1.nil && a !== resources_1.nada && a !== '';
}
exports.isDefined = isDefined;
/**
 * Tests if object is a function
 *
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if object.toString reports it as a Function
 */
function isFunction(a) {
    return getTypeString(a) === resources_1.functionTypeString;
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
    return typeof a === resources_1.numberString;
}
exports.isNumber = isNumber;
function isObject(a) {
    return typeof a === resources_1.objectString && a !== resources_1.nada;
}
exports.isObject = isObject;
/**
 * Tests if object is a string
 *
 * @export
 * @param {*} a object to test
 * @returns {boolean} true if object is typeof string
 */
function isString(a) {
    return typeof a === resources_1.stringString;
}
exports.isString = isString;
function getTypeString(val) {
    return ostring.call(val);
}

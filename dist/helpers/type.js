"use strict";
var ostring = Object.prototype.toString;
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
function isDefined(a) {
    return a !== undefined && a !== null && a !== '';
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

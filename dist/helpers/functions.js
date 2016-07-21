"use strict";
var type_1 = require('./type');
/**
 * Calls the named function for each object in the list
 *
 * @export
 * @param {any[]} targets list of objects on which to call a function
 * @param {string} fnName function name to call on each object
 * @param {any[]} args list of arguments to pass to the function
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
function pipe(initial) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var value = type_1.isFunction(initial) ? initial() : initial;
    var len = arguments.length;
    for (var x = 1; x < len; x++) {
        value = arguments[x](value);
    }
    return value;
}
exports.pipe = pipe;
/**
 * No operation function: a placeholder
 *
 * @export
 */
function noop() {
    // do nothing
}
exports.noop = noop;

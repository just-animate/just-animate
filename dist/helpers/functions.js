"use strict";
var type_1 = require('./type');
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

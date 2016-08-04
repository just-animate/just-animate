"use strict";
var type_1 = require('./type');
exports.pipe = function pipe() {
    var args = arguments;
    var initial = args[0];
    var value = type_1.isFunction(initial) ? initial() : initial;
    var len = args.length;
    for (var x = 1; x < len; x++) {
        value = args[x](value);
    }
    return value;
};

"use strict";
var Helpers_1 = require('./Helpers');
var browserRules = {
    scale3d: function (val, output) {
        if (Helpers_1.isNumber(val)) {
            output.transform = (output.transform || '') + " scale3d(" + val + ", " + val + ", " + val + ")";
            return;
        }
        if (Helpers_1.isArray(val)) {
            var arr = val;
            if (arr.length !== 3) {
                throw Error('scale3d requires x, y, & z');
            }
            output.transform = (output.transform || '') + " scale3d(" + arr[0] + ", " + arr[1] + ", " + arr[2] + ")";
            return;
        }
        throw Error('scale3d requires a number or number[]');
    },
    translate3d: function (val, output) {
        if (Helpers_1.isString(val)) {
            output.transform = (output.transform || '') + " translate3d(" + val + ", " + val + ", " + val + ")";
            return;
        }
        if (Helpers_1.isArray(val)) {
            var arr = val;
            if (arr.length !== 3) {
                throw Error('translate3d requires x, y, & z');
            }
            output.transform = (output.transform || '') + " translate3d(" + arr[0] + ", " + arr[1] + ", " + arr[2] + ")";
            return;
        }
        throw Error('translate3d requires number, string, or an array of strings or numbers');
    }
};
exports.keyframeTransformer = createTransformer(browserRules);
function createTransformer(rules) {
    return function (keyframe) {
        var output = {};
        for (var prop in keyframe) {
            var value = keyframe[prop];
            var transformer = rules[prop];
            if (!transformer) {
                output[prop] = value;
                continue;
            }
            transformer(value, output);
        }
        return output;
    };
}

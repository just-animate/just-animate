"use strict";
var resources_1 = require("./resources");
var linearCubicBezier = function (x) { return x; };
var SUBDIVISION_EPSILON = 0.0001;
/**
 * Clamps a number between the min and max
 *
 * @export
 * @param {number} val number to clamp
 * @param {number} min min number allowed
 * @param {number} max max number allowed
 * @returns {number} val if between min-max, min if lesser, max if greater
 */
function clamp(val, min, max) {
    return val === resources_1.nil ? resources_1.nil : val < min ? min : val > max ? max : val;
}
exports.clamp = clamp;
function inRange(val, min, max) {
    return min < max ? min <= val && val <= max : max <= val && val <= min;
}
exports.inRange = inRange;
function bezier(n1, n2, t) {
    return 3 * n1 * (1 - t) * (1 - t) * t + 3 * n2 * (1 - t) * t * t + t * t * t;
}
function cubicBezier(p0, p1, p2, p3) {
    if (p0 < 0 || p0 > 1 || p2 < 0 || p2 > 1) {
        return linearCubicBezier;
    }
    return function (x) {
        if (x === 0 || x === 1) {
            return x;
        }
        var start = 0;
        var end = 1;
        var limit = 20;
        while (--limit) {
            var mid = (start + end) / 2;
            var xEst = bezier(p0, p2, mid);
            if (Math.abs(x - xEst) < SUBDIVISION_EPSILON) {
                return bezier(p1, p3, mid);
            }
            if (xEst < x) {
                start = mid;
            }
            else {
                end = mid;
            }
        }
        // limit is reached        
        return x;
    };
}
exports.cubicBezier = cubicBezier;

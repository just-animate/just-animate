"use strict";
var linear = function (x) { return x; };
var SUBDIVISION_EPSILON = 0.0001;
function bezier(n1, n2, t) {
    return 3 * n1 * (1 - t) * (1 - t) * t
        + 3 * n2 * (1 - t) * (t * t)
        + (t * t * t);
}
function cubic(p0, p1, p2, p3) {
    if (p0 < 0 || p0 > 1 || p2 < 0 || p2 > 1) {
        return linear;
    }
    return function (x) {
        if (x === 0 || x === 1) {
            return x;
        }
        var start = 0;
        var end = 1;
        var limit = 10;
        while (--limit) {
            var t = (start + end) / 2;
            var xEst = bezier(p0, p2, t);
            if (Math.abs(x - xEst) < SUBDIVISION_EPSILON) {
                return bezier(p1, p3, t);
            }
            if (xEst < x) {
                start = t;
            }
            else {
                end = t;
            }
        }
        // should not end up here        
        return x;
    };
}
exports.cubic = cubic;

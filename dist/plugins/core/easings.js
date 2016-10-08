"use strict";
var strings_1 = require("../../common/strings");
var resources_1 = require("../../common/resources");
var SUBDIVISION_EPSILON = 0.0001;
var cssFunctionRegex = /([a-z-]+)\(([^\)]+)\)/ig;
var linearCubicBezier = function (x) { return x; };
var stepAliases = {
    end: 0,
    start: 1
};
var easings = {
    ease: [resources_1.cubicBezier, .25, .1, .25, 1],
    easeIn: [resources_1.cubicBezier, .42, 0, 1, 1],
    easeInBack: [resources_1.cubicBezier, .6, -.28, .735, .045],
    easeInCirc: [resources_1.cubicBezier, .6, .04, .98, .335],
    easeInCubic: [resources_1.cubicBezier, .55, .055, .675, .19],
    easeInExpo: [resources_1.cubicBezier, .95, .05, .795, .035],
    easeInOut: [resources_1.cubicBezier, .42, 0, .58, 1],
    easeInOutBack: [resources_1.cubicBezier, .68, -.55, .265, 1.55],
    easeInOutCirc: [resources_1.cubicBezier, .785, .135, .15, .86],
    easeInOutCubic: [resources_1.cubicBezier, .645, .045, .355, 1],
    easeInOutExpo: [resources_1.cubicBezier, 1, 0, 0, 1],
    easeInOutQuad: [resources_1.cubicBezier, .455, .03, .515, .955],
    easeInOutQuart: [resources_1.cubicBezier, .77, 0, .175, 1],
    easeInOutQuint: [resources_1.cubicBezier, .86, 0, .07, 1],
    easeInOutSine: [resources_1.cubicBezier, .445, .05, .55, .95],
    easeInQuad: [resources_1.cubicBezier, .55, .085, .68, .53],
    easeInQuart: [resources_1.cubicBezier, .895, .03, .685, .22],
    easeInQuint: [resources_1.cubicBezier, .755, .05, .855, .06],
    easeInSine: [resources_1.cubicBezier, .47, 0, .745, .715],
    easeOut: [resources_1.cubicBezier, 0, 0, .58, 1],
    easeOutBack: [resources_1.cubicBezier, .175, .885, .32, 1.275],
    easeOutCirc: [resources_1.cubicBezier, .075, .82, .165, 1],
    easeOutCubic: [resources_1.cubicBezier, .215, .61, .355, 1],
    easeOutExpo: [resources_1.cubicBezier, .19, 1, .22, 1],
    easeOutQuad: [resources_1.cubicBezier, .25, .46, .45, .94],
    easeOutQuart: [resources_1.cubicBezier, .165, .84, .44, 1],
    easeOutQuint: [resources_1.cubicBezier, .23, 1, .32, 1],
    easeOutSine: [resources_1.cubicBezier, .39, .575, .565, 1],
    elegantSlowStartEnd: [resources_1.cubicBezier, .175, .885, .32, 1.275],
    linear: [resources_1.cubicBezier, 0, 0, 1, 1],
    stepEnd: [resources_1.steps, 1, 'end'],
    stepStart: [resources_1.steps, 1, 'start']
};
var defaultEasing = easings.ease;
function getEasingString(easingString) {
    // if no function supplied return linear as cubic
    if (easingString) {
        // if starts with known css function, return with no parsing
        if (strings_1.startsWith(easingString, resources_1.cubicBezier) || strings_1.startsWith(easingString, resources_1.steps)) {
            return easingString;
        }
        // get name as camel case
        var def = easings[strings_1.toCamelCase(easingString)];
        if (def) {
            return strings_1.cssFunction.apply(resources_1.nil, def);
        }
    }
    return strings_1.cssFunction.apply(resources_1.nil, defaultEasing);
}
exports.getEasingString = getEasingString;
function getEasingFunction(easingString) {
    var parts = getEasingDef(easingString);
    return parts[0] === resources_1.steps
        ? steps(parts[1], parts[2])
        : cubic(parts[1], parts[2], parts[3], parts[4]);
}
exports.getEasingFunction = getEasingFunction;
function getEasingDef(easingString) {
    if (!easingString) {
        return defaultEasing;
    }
    var def = easings[strings_1.toCamelCase(easingString)];
    if (def && def.length) {
        return def;
    }
    var matches = cssFunctionRegex.exec(easingString);
    if (matches && matches.length) {
        return matches.slice(1);
    }
    return defaultEasing;
}
function bezier(n1, n2, t) {
    return 3 * n1 * (1 - t) * (1 - t) * t + 3 * n2 * (1 - t) * t * t + t * t * t;
}
function cubic(p0, p1, p2, p3) {
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
exports.cubic = cubic;
function steps(count, pos) {
    var p = stepAliases.hasOwnProperty(pos)
        ? stepAliases[pos]
        : pos;
    var ratio = count / 1;
    return function (x) { return x >= 1 ? 1 : (p * ratio + x) - (p * ratio + x) % ratio; };
}
exports.steps = steps;

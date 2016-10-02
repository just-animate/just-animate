"use strict";
var strings_1 = require("../../common/strings");
var resources_1 = require("../../common/resources");
var easings = {
    ease: [resources_1.cubicBezier, 0.25, 0.1, 0.25, 1],
    easeIn: [resources_1.cubicBezier, 0.42, 0, 1, 1],
    easeInBack: [resources_1.cubicBezier, 0.6, -0.28, 0.735, 0.045],
    easeInCirc: [resources_1.cubicBezier, 0.6, 0.04, 0.98, 0.335],
    easeInCubic: [resources_1.cubicBezier, 0.55, 0.055, 0.675, 0.19],
    easeInExpo: [resources_1.cubicBezier, 0.95, 0.05, 0.795, 0.035],
    easeInOut: [resources_1.cubicBezier, 0.42, 0, 0.58, 1],
    easeInOutBack: [resources_1.cubicBezier, 0.68, -0.55, 0.265, 1.55],
    easeInOutCirc: [resources_1.cubicBezier, 0.785, 0.135, 0.15, 0.86],
    easeInOutCubic: [resources_1.cubicBezier, 0.645, 0.045, 0.355, 1],
    easeInOutExpo: [resources_1.cubicBezier, 1, 0, 0, 1],
    easeInOutQuad: [resources_1.cubicBezier, 0.455, 0.03, 0.515, 0.955],
    easeInOutQuart: [resources_1.cubicBezier, 0.77, 0, 0.175, 1],
    easeInOutQuint: [resources_1.cubicBezier, 0.86, 0, 0.07, 1],
    easeInOutSine: [resources_1.cubicBezier, 0.445, 0.05, 0.55, 0.95],
    easeInQuad: [resources_1.cubicBezier, 0.55, 0.085, 0.68, 0.53],
    easeInQuart: [resources_1.cubicBezier, 0.895, 0.03, 0.685, 0.22],
    easeInQuint: [resources_1.cubicBezier, 0.755, 0.05, 0.855, 0.06],
    easeInSine: [resources_1.cubicBezier, 0.47, 0, 0.745, 0.715],
    easeOut: [resources_1.cubicBezier, 0, 0, 0.58, 1],
    easeOutBack: [resources_1.cubicBezier, 0.175, 0.885, 0.32, 1.275],
    easeOutCirc: [resources_1.cubicBezier, 0.075, 0.82, 0.165, 1],
    easeOutCubic: [resources_1.cubicBezier, 0.215, 0.61, 0.355, 1],
    easeOutExpo: [resources_1.cubicBezier, 0.19, 1, 0.22, 1],
    easeOutQuad: [resources_1.cubicBezier, 0.25, 0.46, 0.45, 0.94],
    easeOutQuart: [resources_1.cubicBezier, 0.165, 0.84, 0.44, 1],
    easeOutQuint: [resources_1.cubicBezier, 0.23, 1, 0.32, 1],
    easeOutSine: [resources_1.cubicBezier, 0.39, 0.575, 0.565, 1],
    elegantSlowStartEnd: [resources_1.cubicBezier, 0.175, 0.885, 0.32, 1.275],
    linear: [resources_1.cubicBezier, 0, 0, 1, 1],
    stepEnd: [resources_1.steps, 'end'],
    stepStart: [resources_1.steps, 'start']
};
function getEasingString(easingString) {
    // if no function supplied return linear as cubic
    if (easingString) {
        // if starts with known css function, return with no parsing
        if (strings_1.startsWith(easingString, resources_1.cubicBezier) || strings_1.startsWith(easingString, resources_1.steps)) {
            return easingString;
        }
        // get name as camel case
        var name_1 = strings_1.toCamelCase(easingString);
        var def = easings[name_1];
        if (def) {
            return strings_1.cssFunction.apply(resources_1.nil, def);
        }
    }
    return strings_1.cssFunction.apply(resources_1.nil, easings.ease);
}
exports.getEasingString = getEasingString;

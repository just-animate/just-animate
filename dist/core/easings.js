"use strict";
var strings_1 = require('../helpers/strings');
var resources_1 = require('../helpers/resources');
exports.easings = {
    easeInBack: strings_1.cssFunction(resources_1.cubicBezier, 0.6, -0.28, 0.735, 0.045),
    easeInCirc: strings_1.cssFunction(resources_1.cubicBezier, 0.6, 0.04, 0.98, 0.335),
    easeInCubic: strings_1.cssFunction(resources_1.cubicBezier, 0.55, 0.055, 0.675, 0.19),
    easeInExpo: strings_1.cssFunction(resources_1.cubicBezier, 0.95, 0.05, 0.795, 0.035),
    easeInOutBack: strings_1.cssFunction(resources_1.cubicBezier, 0.68, -0.55, 0.265, 1.55),
    easeInOutCirc: strings_1.cssFunction(resources_1.cubicBezier, 0.785, 0.135, 0.15, 0.86),
    easeInOutCubic: strings_1.cssFunction(resources_1.cubicBezier, 0.645, 0.045, 0.355, 1),
    easeInOutExpo: strings_1.cssFunction(resources_1.cubicBezier, 1, 0, 0, 1),
    easeInOutQuad: strings_1.cssFunction(resources_1.cubicBezier, 0.455, 0.03, 0.515, 0.955),
    easeInOutQuart: strings_1.cssFunction(resources_1.cubicBezier, 0.77, 0, 0.175, 1),
    easeInOutQuint: strings_1.cssFunction(resources_1.cubicBezier, 0.86, 0, 0.07, 1),
    easeInOutSine: strings_1.cssFunction(resources_1.cubicBezier, 0.445, 0.05, 0.55, 0.95),
    easeInQuad: strings_1.cssFunction(resources_1.cubicBezier, 0.55, 0.085, 0.68, 0.53),
    easeInQuart: strings_1.cssFunction(resources_1.cubicBezier, 0.895, 0.03, 0.685, 0.22),
    easeInQuint: strings_1.cssFunction(resources_1.cubicBezier, 0.755, 0.05, 0.855, 0.06),
    easeInSine: strings_1.cssFunction(resources_1.cubicBezier, 0.47, 0, 0.745, 0.715),
    easeOutBack: strings_1.cssFunction(resources_1.cubicBezier, 0.175, 0.885, 0.32, 1.275),
    easeOutCirc: strings_1.cssFunction(resources_1.cubicBezier, 0.075, 0.82, 0.165, 1),
    easeOutCubic: strings_1.cssFunction(resources_1.cubicBezier, 0.215, 0.61, 0.355, 1),
    easeOutExpo: strings_1.cssFunction(resources_1.cubicBezier, 0.19, 1, 0.22, 1),
    easeOutQuad: strings_1.cssFunction(resources_1.cubicBezier, 0.25, 0.46, 0.45, 0.94),
    easeOutQuart: strings_1.cssFunction(resources_1.cubicBezier, 0.165, 0.84, 0.44, 1),
    easeOutQuint: strings_1.cssFunction(resources_1.cubicBezier, 0.23, 1, 0.32, 1),
    easeOutSine: strings_1.cssFunction(resources_1.cubicBezier, 0.39, 0.575, 0.565, 1),
    elegantSlowStartEnd: strings_1.cssFunction(resources_1.cubicBezier, 0.175, 0.885, 0.32, 1.275)
};

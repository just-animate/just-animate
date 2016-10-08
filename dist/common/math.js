"use strict";
var resources_1 = require("./resources");
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

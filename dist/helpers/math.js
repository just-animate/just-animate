"use strict";
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
    return val === undefined ? undefined : val < min ? min : val > max ? max : val;
}
exports.clamp = clamp;

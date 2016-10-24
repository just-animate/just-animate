/**
 * Clamps a number between the min and max
 * 
 * @export
 * @param {number} val number to clamp
 * @param {number} min min number allowed
 * @param {number} max max number allowed
 * @returns {number} val if between min-max, min if lesser, max if greater
 */
export function clamp(val: number, min: number, max: number): number {
    return val === undefined ? undefined : val < min ? min : val > max ? max : val;
}

export function inRange(val: number, min: number, max: number): boolean {
    return min < max ? min <= val && val <= max : max <= val && val <= min;
}

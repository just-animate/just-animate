import { nil } from './resources';

const linearCubicBezier: ja.Func<number> = (x: number) => x;
const SUBDIVISION_EPSILON = 0.0001;


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
    return val === nil ? nil : val < min ? min : val > max ? max : val;
}

export function inRange(val: number, min: number, max: number): boolean {
    return min < max ? min <= val && val <= max : max <= val && val <= min;
}

function bezier(n1: number, n2: number, t: number): number {
    return 3 * n1 * (1 - t) * (1 - t) * t + 3 * n2 * (1 - t) * t * t + t * t * t;
}

export function cubicBezier(p0: number, p1: number, p2: number, p3: number): ja.Func<number> {
    if (p0 < 0 || p0 > 1 || p2 < 0 || p2 > 1) {
        return linearCubicBezier;
    }

    return function(x: number): number {
        if (x === 0 || x === 1) {
            return x;
        }

        let start = 0;
        let end = 1;
        let limit = 20;

        while (--limit) {
            const mid = (start + end) / 2;
            const xEst = bezier(p0, p2, mid);

            if (Math.abs(x - xEst) < SUBDIVISION_EPSILON) {
                return bezier(p1, p3, mid);
            }
            if (xEst < x) {
                start = mid;
            } else {
                end = mid;
            }
        }

        // limit is reached        
        return x;
    };
}

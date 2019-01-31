import { linear } from "./linear";

const MAX_ITERATIONS = 19;

// calculates cubic bezier value in one dimension, assuming initial point = 0
// and final point = 1
const bezier = (c1: number, c2: number, t: number) => {
  const it = 1 - t;
  return ((it * c1 + t * c2) * 3 * it + t * t) * t;
};

export const cubicBezier = (
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number
) => {
  // Ensure converted to numbers since they might actually be strings.
  cx1 = +cx1;
  cy1 = +cy1;
  cx2 = +cx2;
  cy2 = +cy2;
  // if control point x component is out of range 0..1, return linear ease
  // function instead of cubic bezier ease
  if (cx1 < 0 || cx1 > 1 || cx2 < 0 || cx2 > 1) {
    return linear;
  }

  return (t: number) => {
    // return linear if out of bounds
    if (t <= 0 || t >= 1) {
      return t;
    }

    let min = 0;
    let max = 1;
    let iterations = MAX_ITERATIONS;
    let mid: number;
    let tPos: number;

    do {
      mid = 0.5 * (min + max);
      tPos = bezier(cx1, cx2, mid);
      // if this curve point is close enough to the target t value,
      // return the ease value here
      if (Math.abs(t - tPos) < 0.0001) {
        return bezier(cy1, cy2, mid);
      }
      // update bounds and try again
      if (tPos < t) {
        min = mid;
      } else {
        max = mid;
      }
    } while (--iterations);

    // iteration limit reached, return the ease value at the current
    // point on the curve
    mid = 0.5 * (min + max);
    return bezier(cy1, cy2, mid);
  };
};

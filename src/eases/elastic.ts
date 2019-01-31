import { inOut } from "./inOut";
import { ja } from "../types";

const TAU = 2 * Math.PI;

export function elastic(
  type?: ja.EaseTypes,
  amplitude?: number,
  period?: number,
  bounces?: number
) {
  // Add defaults where necessary and convert from string.
  amplitude = +(amplitude || amplitude === 0 ? amplitude : 1);
  period = +(period || period === 0 ? period : 0.4);
  bounces = +(bounces || bounces === 0 ? bounces : 4);

  const s = period / bounces;
  return inOut(n => {
    if (n === 0 || n === 1) {
      return n;
    }
    return (
      -amplitude! *
      Math.pow(2, 10 * (n - 1)) *
      Math.sin(((n - 1 - s) * TAU) / period!)
    );
  }, type);
}

import { ja } from "../types";

export function inOut(ease: ja.Ease, type?: ja.EaseTypes) {
  if (type === "out") {
    return (o: number) => 1 - ease(1 - o);
  }
  if (type === "in-out") {
    return (o: number) =>
      o < 0.5 ? ease(o * 2.0) / 2.0 : 1 - ease((1 - o) * 2) / 2;
  }
  return ease;
}

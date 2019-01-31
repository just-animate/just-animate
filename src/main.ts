import { Timeline } from "./components/timeline";
import { ja } from "./types";
import { nextAnimationFrame, tick } from "./services/tick";
import { getEase, eases } from "./parsers/eases";

export function animate<T>(
  targets: T | string,
  duration: number,
  props: Partial<ja.KeyframeProps>
) {
  return new Timeline().animate(targets, duration, props);
}

export { nextAnimationFrame, eases, getEase, tick, Timeline };

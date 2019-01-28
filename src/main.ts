import { TimelineAnimation } from "./components/timeline";
import { ja } from "./types";
import { nextAnimationFrame, tick } from "./services/tick";

export function animate<T>(
  targets: T | string,
  duration: number,
  props: Partial<ja.KeyframeProps>
) {
  return new TimelineAnimation().animate(targets, duration, props);
}

export function timeline(opts?: Partial<ja.TimelineConfig>): TimelineAnimation {
  return new TimelineAnimation(opts);
}

export { nextAnimationFrame, tick };

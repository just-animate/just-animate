import { TimelineAnimation } from "./timeline";
import { ja } from "./types";

export function timeline(opts?: Partial<ja.AnimationState>): TimelineAnimation {
  return new TimelineAnimation(opts);
}

export { tick, nextAnimationFrame } from "./loop";

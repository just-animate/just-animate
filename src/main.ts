import { TimelineAnimation } from "./timeline";
import { ja } from "./types";

export function timeline(opts?: Partial<ja.AnimationState>): TimelineAnimation {
  return new TimelineAnimation(opts);
}

export { render } from "./render";
export { nextAnimationFrame, tick } from "./loop";

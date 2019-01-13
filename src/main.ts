import { TimelineAnimation } from "./timeline";
import { ja } from "./types";
import { nextAnimationFrame, tick } from "./loop";

function timeline(opts?: Partial<ja.TimelineConfig>): TimelineAnimation {
  return new TimelineAnimation(opts);
}

export { timeline, nextAnimationFrame, tick };

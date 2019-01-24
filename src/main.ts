import { TimelineAnimation } from "./components/timeline";
import { ja } from "./types";
import { nextAnimationFrame, tick } from "./services/tick";

function timeline(opts?: Partial<ja.TimelineConfig>): TimelineAnimation {
  return new TimelineAnimation(opts);
}

export { timeline, nextAnimationFrame, tick };

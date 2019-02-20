import { back } from './eases/back';
import { bounce } from './eases/bounce';
import { cubicBezier } from './eases/cubicBezier';
import { yoyo } from './eases/yoyo';
import { repeat } from './eases/repeat';
import { getEase, eases } from './eases/eases';
import { ja } from './types';
import { nextAnimationFrame, tick } from './services/tick';
import { power } from './eases/power';
import { sine } from './eases/sine';
import { steps } from './eases/steps';
import { Timeline } from './components/timeline';
import { elastic } from './eases/elastic';
import { renderers } from './services/animator';
import { renderTween } from './renderers/renderTween';
import { renderSubtimeline } from './renderers/renderSubtimeline';

// Register second half of Timeline
import './components/timeline.animate';

// Register built-in easings
// Linear is the fallback when an easing isn't found, so we won't register it.
eases.back = back;
eases.bounce = bounce;
eases['cubic-bezier'] = cubicBezier;
eases.elastic = elastic;
eases.power = power;
eases.repeat = repeat;
eases.sine = sine;
eases.steps = steps;
eases.yoyo = yoyo;

// Register timeline renderers.
renderers.push(renderSubtimeline);
renderers.push(renderTween);

/**
 * Convenience method for doing animations.
 */
function animate<T>(
  targets: T | string,
  duration: number,
  props: Partial<ja.KeyframeProps>
) {
  return new Timeline().animate(targets, duration, props);
}

// Export out globals.
export { animate, eases, getEase, nextAnimationFrame, Timeline, tick };

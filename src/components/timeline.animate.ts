import { Timeline } from './timeline';
import { resolveTargets } from '../services/targets';
import { ja } from '../types';

/**
 * Configure a tween from the (current) position for the duration specified.
 * @param targets The element, object, or selector to animate.
 * @param duration The duration in milliseconds of the tween.
 * @param props The end state properties of the tween.
 * if not specified.
 * @public
 */
function animate<T>(
  this: Timeline,
  targets: T | string,
  duration: number,
  props: Partial<ja.KeyframeProps>
): Timeline {
  let pos = this.getPosition_(props.$from);
  if (pos == null) {
    pos = this.duration;
  }

  /* If the target is not a string, create an alias so the keyframe can be
   * stored separatedly from the objects themselves. */
  if (typeof targets !== 'string') {
    let targetId = findTarget(this.targets, targets);
    if (!targetId) {
      if (!this.targetIds) {
        this.targetIds = 0;
      }
      targetId = '@_object_' + ++this.targetIds;
      this.target(targetId, targets);
    }
    targets = targetId;
  }

  if (props.$delay) {
    duration += props.$delay;
  }
  if (props.$endDelay) {
    duration += props.$endDelay;
  }
  if (props.$stagger) {
    // Extend the duration to fit staggering in all of the targets.
    duration += resolveTargets(this, targets).length * props.$stagger;
  }

  let targetProps = this.keyframes[targets];
  if (!targetProps) {
    targetProps = this.keyframes[targets] = {};
  }

  for (const prop in props) {
    const value = props[prop];
    // Handle all properties (not $ease, etc.)
    if (prop[0] !== '$' && (value || value === 0)) {
      // Get or create a property to hold this keyframe.
      let propKeyframes = targetProps[prop];
      if (!propKeyframes) {
        propKeyframes = targetProps[prop] = {};
      }
      // Copy options to individual keyframe. ($ease, etc.)
      const keyframe = { value } as ja.Keyframe;
      for (const option in props) {
        if (option[0] === '$' && props[option]) {
          keyframe[option] = props[option];
        }
      }
      propKeyframes[pos + duration] = keyframe;
    }
  }

  return this.update();
}

/**
 * Adds a delay at the current position.
 * @param duration the amount to delay.
 * @public
 */
function delay(this: Timeline, duration: number): Timeline {
  return this.animate('', duration, { '': 0 });
}

/**
 * Sets the properties at a given time. This is a convenience method for
 * calling animate with an ease of steps(1, end).
 * @public
 */
function set<T>(
  this: Timeline,
  targets: T | string,
  props: ja.KeyframeProps
): Timeline {
  props.$ease = 'steps(1,end)';
  return this.animate(targets, 0, props);
}

/**
 * Creates a target alias that can be referred to in the targets parameter in
 * animate() and set().  It is recommended to prefix the alias with @ to
 * prevent conflicts with CSS selectors. This is useful for creating generic
 * animations where the target is not known when defining the tweens.
 * @param alias
 * @param target
 * @public
 */
function target(
  this: Timeline,
  alias: string,
  target: ja.AnimationTarget
): Timeline {
  if (!this.targets) {
    this.targets = {};
  }
  this.targets[alias] = target;
  // If targets change, ensure update in case a target has been replaced.
  return this.update();
}

function findTarget(
  targets: Record<string, ja.AnimationTarget>,
  target: ja.AnimationTarget
): string | undefined {
  if (targets) {
    for (const targetid in targets) {
      if (target === targets[targetid]) {
        return targetid;
      }
    }
  }
}

Timeline.prototype.animate = animate;
Timeline.prototype.delay = delay;
Timeline.prototype.set = set;
Timeline.prototype.target = target;

declare module './timeline' {
  interface Timeline {
    animate: typeof animate;
    delay: typeof delay;
    set: typeof set;
    target: typeof target;
    targetIds: number;
    targets: Record<string, ja.AnimationTarget>;
  }
}

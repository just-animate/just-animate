import { byNumber, clamp, toNumber, findLowerIndex } from "./numbers";
import { getAnimator } from "./render";
import { ja } from "./types";
import { tick } from "./loop";

const FRAME_SIZE = 1000 / 60;

const queue: ja.TimelineConfigurator[] = [];
let lastTime: number;

/**
 * Enqueues the timeline to be updated and rendered.
 * @param configurator
 */
export function animate(configurator: ja.TimelineConfigurator) {
  if (!queue.length) {
    lastTime = performance.now();
    tick(processTimelines);
  }
  if (queue.indexOf(configurator) === -1) {
    queue.push(configurator);
  }
}

/**
 * Gets all of the times in the property in order.
 * @param property The property from which to extract times.
 */
function getTimes(property: Record<string, ja.Keyframe>) {
  return Object.keys(property)
    .map(toNumber)
    .sort(byNumber);
}

/**
 * Updates all the timelines.
 * @param time
 */
function processTimelines(time: number) {
  // Determine the delta, clamp between 0ms and 34ms (0 frames and 2 frames).
  const delta = clamp(time - lastTime, 0, FRAME_SIZE * 2);
  lastTime = time;
  // Get a list of all configs, this should match by index, the queue.
  const configs = queue.map(configurator => configurator.getConfig());
  // Update timing and fix inconsistencies.
  for (const config of configs) {
    updateTiming(delta, config);
  }
  // Update the playStates.
  for (const config of configs) {
    updatePlayState(config);
  }
  // Queue up all events.
  const listenersToCall: ja.AnimationEventListener[] = [];
  for (const config of configs) {
    for (const event of config.events) {
      if (config.listeners) {
        const listeners = config.listeners[event];
        if (listeners && listeners.length) {
          Array.prototype.push.apply(listenersToCall, listeners);
        }
      }
    }
  }
  // Render changes to the targets.
  const operations: Array<() => void> = [];
  for (const config of configs) {
    renderState(config, operations);
  }
  // Write configurations back to their configurators.
  for (let i = 0; i < queue.length; i++) {
    queue[i].configure(configs[i]);
  }
  // Remove items from the queue if they no longer need to be updated.
  for (let i = queue.length - 1; i > -1; i--) {
    if (configs[i].playState === "idle") {
      queue.splice(i, 1);
    }
  }
  // Call all render operations.
  for (const operation of operations) {
    operation();
  }
  // Call all listener callbacks.
  for (const listener of listenersToCall) {
    listener(time);
  }
  // Continue on the next loop if any configurators remain.
  return !!queue.length;
}

/**
 * Renders the current state of the dopesheet.
 * @param config The configuration to read.
 */
function renderState(config: ja.TimelineConfig, operations: Array<() => void>) {
  const { currentTime } = config;
  for (const targetName in config.keyframes) {
    const keyframes = config.keyframes[targetName];
    const targets = resolveTargets(config, targetName);
    for (const propName in keyframes) {
      const property = keyframes[propName];
      const times = getTimes(property);
      const lowerIndex = findLowerIndex(times, currentTime);
      const lowerTime = lowerIndex === -1 ? 0 : times[lowerIndex];

      // Get the final value. This can be done for all targets.
      const higherTime = times[Math.max(lowerIndex + 1, times.length)];
      const upperFrame = property[higherTime];

      for (const target of targets) {
        const animator = getAnimator(target, propName);
        let lowerFrame: ja.Keyframe;
        if (lowerIndex === -1) {
          // Get the lower value. This has to be done after getting the animator
          // because we need to know how to read the original value.
          lowerFrame = {
            value: animator.read(target, propName),
            stagger: 0
          };
          property[0] = lowerFrame;
        } else {
          lowerFrame = property[times[lowerIndex]];
        }

        // Get the current value and calculate the next value, only attempt to
        // render if they are different. It is assumed that the cost of reading
        // constantly is less than the cost of writing constantly.
        const offset = (lowerTime + higherTime) / 2;
        const currentValue = animator.read(target, propName);
        const value = animator.mix(lowerFrame.value, upperFrame.value, offset);
        if (currentValue !== value) {
          // Queue up the rendering of the value.
          operations.push(() => animator.write(target, propName, value));
        }
      }
    }
  }
}

/**
 * Resolves a selector or an at-target.
 * @param config The timeline configuration.
 * @param target The target to resolve.
 */
function resolveTargets(config: ja.TimelineConfig, target: string): Array<{}> {
  if (!target) {
    return [];
  }
  if (target.indexOf("@") !== 0) {
    // TODO:(add component scoping here)
    // If it isn't a reference, use it as a selector and make that into an [].
    return Array.prototype.slice.call(document.querySelectorAll(target));
  }
  // Get the target if it exists
  const maybeTarget = config.targets[target];
  if (!maybeTarget) {
    throw Error("Target " + target + " not configured.");
  }
  // If the target is an array, just return it.
  if (typeof (maybeTarget as []).length === "number") {
    return maybeTarget as Array<{}>;
  }
  // If the target is not an array, wrap it.
  return [maybeTarget];
}

function updatePlayState(config: ja.TimelineConfig) {
  if (config.playState === "cancel") {
    config.playState = "idle";
  } else if (config.playState === "finish") {
    config.playState = "idle";
  } else {
    const activeDuration = config.duration * config.iterations;
    if (config.playbackRate < 0) {
      if (config.currentTime === 0) {
        config.playState = "idle";
        config.events.push("finish");
      }
    } else {
      if (config.currentTime === activeDuration) {
        config.playState = "idle";
        config.events.push("finish");
      }
    }
  }
}

/**
 * Updates the configuration with the amount of time that has elapsed since the
 * last update.
 * @param delta The amount of milliseconds since the last update.
 * @param config The configuration to update.
 */
function updateTiming(delta: number, config: ja.TimelineConfig) {
  // Make sure iterations is at least 1 and below Infinity.
  const SECONDS_IN_A_DAY = 86400;
  config.iterations = clamp(config.iterations, 1, SECONDS_IN_A_DAY * 7);

  // Figure out the active duration.
  const activeDuration = config.duration * config.iterations;

  if (config.playState === "cancel") {
    // Reset the timeline.
    config.currentTime = 0;
    config.playbackRate = 1;
  } else if (config.playState === "finish") {
    // Finish at 0 or the duration based on the playbackRate.
    config.currentTime = config.playbackRate < 0 ? 0 : activeDuration;
  } else {
    if (config.playState === "running") {
      // Find the current time and clamp it between 0 and the active duration.
      config.currentTime += delta * config.playbackRate;
    }
  }

  // Ensure current time is not out of bounds.
  config.currentTime = clamp(config.currentTime, 0, activeDuration);
}

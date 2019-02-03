import { byNumber, clamp, toNumber, findUpperIndex } from '../utils/numbers';
import { ja } from '../types';
import { tick } from './tick';
import { detectTargetType, getReader, getWriter, getMixer } from '../adapters';
import { retrieveValue, storeValue, clearKeys } from './valuecache';
import { getEase } from '../main';

const FRAME_SIZE = 1000 / 60;

const queue: ja.TimelineConfig[] = [];
let lastTime: number;

/**
 * Enqueues the timeline to be updated and rendered.
 * @param configurator
 */
export function queueTransition(configurator: ja.TimelineConfig) {
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
  const configs = queue.slice();
  // Detect automatic playState changes
  for (const config of configs) {
    detectPlayStateChanges(config);
  }
  // Update timing and fix inconsistencies.
  for (const config of configs) {
    updateTiming(delta, config);
  }
  // Update the transient playStates.
  for (const config of configs) {
    if (config.playState === 'cancel') {
      config.playState = 'idle';
    } else if (config.playState === 'finish') {
      config.playState = 'paused';
    }
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
    // Remove configuration events.
    config.events.length = 0;
  }
  // Render changes to the targets.
  const operations: Array<() => void> = [];
  for (const config of configs) {
    renderState(config, operations);
  }
  // // Write configurations back to their configurators.
  // for (let i = 0; i < queue.length; i++) {
  //   queue[i].configure(configs[i]);
  // }
  // Remove items from the queue if they no longer need to be updated.
  for (let i = queue.length - 1; i > -1; i--) {
    if (configs[i].playState !== 'running') {
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
  const { currentTime, playState, id } = config;
  for (const targetName in config.keyframes) {
    const keyframes = config.keyframes[targetName];
    const targets = resolveTargets(config, targetName);
    for (const propName in keyframes) {
      const property = keyframes[propName];
      const times = getTimes(property);

      for (const target of targets) {
        // Unpack these immediately because the return object is shared.
        const targetType = detectTargetType(target, propName);
        const write = getWriter(targetType);
        if (playState !== 'idle') {
          const read = getReader(targetType);
          const mix = getMixer(targetType);
          const currentValue = read(target, propName);
          const upperIndex = findUpperIndex(times, currentTime);
          const lowerIndex = upperIndex - 1;

          const lowerTime = lowerIndex < 0 ? 0 : times[lowerIndex];

          // Get the final value. This can be done for all targets.
          const upperTime = times[upperIndex];
          const upperValue = property[upperTime].value;
          const upperEase = getEase(property[upperTime].ease || 'linear');
          const lowerFrame = property[times[lowerIndex]];

          // Attempt to load initial value from cache or add the current as init
          let lowerValue: ja.AnimationValue;

          if (lowerIndex < 0 || !lowerFrame) {
            let initialValue = retrieveValue(id, target, propName);
            if (initialValue == null) {
              initialValue = currentValue;
              storeValue(id, target, propName, currentValue);
            }
            lowerValue = initialValue;
          } else {
            lowerValue = lowerFrame.value;
          }

          // Calculate the offset and apply the easing
          const offset = upperEase(
            // If lower and upper time are the same, the offset is 0; hard code
            // this, because it breaks the formula (NaN).
            upperTime === lowerTime
              ? 1
              : (currentTime - lowerTime) / (upperTime - lowerTime)
          );

          // Find the next value, but only set it if it differs from the current
          // value.
          const value = mix(lowerValue, upperValue, offset);
          if (currentValue !== value) {
            // Queue up the rendering of the value.
            operations.push(() => write(target, propName, value));
          }
        } else {
          const initialValue = retrieveValue(id, target, propName);
          if (initialValue != null) {
            write(target, propName, initialValue);
          }
        }
      }
    }

    // Clear cache for targets that have gone idle.
    for (const target of targets) {
      if (playState === 'idle') {
        clearKeys(id, target);
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
  if (target.indexOf('@') !== 0) {
    // TODO:(add component scoping here)
    // If it isn't a reference, use it as a selector and make that into an [].
    return Array.prototype.slice.call(document.querySelectorAll(target));
  }
  // Get the target if it exists
  const maybeTarget = config.targets[target];
  if (!maybeTarget) {
    throw Error('Target ' + target + ' not configured.');
  }
  // If the target is an array, just return it.
  if (typeof (maybeTarget as []).length === 'number') {
    return maybeTarget as Array<{}>;
  }
  // If the target is not an array, wrap it.
  return [maybeTarget];
}

function detectPlayStateChanges(config: ja.TimelineConfig) {
  if (config.playState === 'running') {
    const isBackwards = config.playbackRate < 0;
    const activeDuration = config.duration * config.iterations;
    // If it is off by one, clamp it.
    const isFinished =
      (isBackwards && config.currentTime <= 1) ||
      (!isBackwards && config.currentTime >= activeDuration - 1);

    if (isFinished) {
      config.playState = 'finish';
      config.events.push('finish');
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

  if (config.playState === 'cancel') {
    // Reset the timeline.
    config.currentTime = 0;
    config.playbackRate = 1;
  } else if (config.playState === 'finish') {
    // Finish at 0 or the duration based on the playbackRate.
    config.currentTime = config.playbackRate < 0 ? 0 : activeDuration;
  } else {
    if (config.playState === 'running') {
      // Find the current time and clamp it between 0 and the active duration.
      config.currentTime += delta * config.playbackRate;
    }
  }

  // Ensure current time is not out of bounds.
  config.currentTime = clamp(config.currentTime, 0, activeDuration);
}

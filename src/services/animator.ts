import { clamp } from '../utils/numbers';
import { ja } from '../types';
import { tick } from './tick';
import { IDLE, CANCEL, FINISH, PAUSED, RUNNING } from '../utils/playStates';

const FRAME_SIZE = 1000 / 60;

const queue: ja.TimelineConfig[] = [];
let lastTime: number;

export const renderers: Array<
  (config: ja.TimelineConfig, operations: Array<() => void>) => void
> = [];

/**
 * Enqueues the timeline to be updated and rendered.
 * @param configurator
 */
export function queueTransition<T extends ja.TimelineConfig>(
  configurator: T
): T {
  if (!queue.length) {
    lastTime = performance.now();
    tick(processTimelines);
  }
  if (queue.indexOf(configurator) === -1) {
    queue.push(configurator);
  }
  return configurator;
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
    if (config.playState === CANCEL) {
      config.playState = IDLE;
    } else if (config.playState === FINISH) {
      config.playState = PAUSED;
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
    for (const renderer of renderers) {
      renderer(config, operations);
    }
  }
  // // Write configurations back to their configurators.
  // for (let i = 0; i < queue.length; i++) {
  //   queue[i].configure(configs[i]);
  // }
  // Remove items from the queue if they no longer need to be updated.
  for (let i = queue.length - 1; i > -1; i--) {
    if (configs[i].playState !== RUNNING) {
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

function detectPlayStateChanges(config: ja.TimelineConfig) {
  if (config.playState === RUNNING) {
    const isBackwards = config.playbackRate < 0;
    const activeDuration = config.duration * config.iterations;
    // If it is off by one, clamp it.
    const isFinished =
      (isBackwards && config.currentTime <= 1) ||
      (!isBackwards && config.currentTime >= activeDuration - 1);

    if (isFinished) {
      config.playState = FINISH;
      config.events.push(FINISH);
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

  if (config.playState === CANCEL) {
    // Reset the timeline.
    config.currentTime = 0;
    config.playbackRate = 1;
  } else if (config.playState === FINISH) {
    // Finish at 0 or the duration based on the playbackRate.
    config.currentTime = config.playbackRate < 0 ? 0 : activeDuration;
  } else {
    if (config.playState === RUNNING) {
      // Find the current time and clamp it between 0 and the active duration.
      config.currentTime += delta * config.playbackRate;
    }
  }

  // Ensure current time is not out of bounds.
  config.currentTime = clamp(config.currentTime, 0, activeDuration);
}

import { byNumber, clamp, toNumber, findUpperIndex } from '../utils/numbers';
import { detectTargetType, getReader, getWriter, getMixer } from '../adapters';
import { retrieveValue, storeValue, clearKeys } from '../services/valuecache';
import { getEase } from '../main';
import { resolveTargets } from '../services/targets';
import { ja } from '../types';
import { IDLE } from '../utils/playStates';

/**
 * Renders the current state of the dopesheet.
 * @param config The configuration to read.
 */
export function renderTween(
  config: ja.TimelineConfig,
  operations: Array<() => void>
) {
  const { currentTime, playState, id } = config;
  const localTime = currentTime % config.duration;
  for (const targetName in config.keyframes) {
    const keyframes = config.keyframes[targetName];
    const targets = resolveTargets(config, targetName);
    for (const propName in keyframes) {
      const property = keyframes[propName];
      const times = getTimes(property);
      const total = targets.length;
      for (let index = 0; index < total; index++) {
        const target = targets[index];
        // Unpack these immediately because the return object is shared.
        const targetType = detectTargetType(target, propName);
        const write = getWriter(targetType);
        if (playState !== IDLE) {
          const read = getReader(targetType);
          const mix = getMixer(targetType);
          const currentValue = read(target, propName);
          const maybeUpperIndex = findUpperIndex(times, localTime);
          const upperIndex = clamp(maybeUpperIndex, 0, times.length - 1);
          // If the last frame is out of range, use the last frame for both
          // upper and lower indexes.
          const lowerIndex =
            upperIndex !== maybeUpperIndex ? upperIndex : upperIndex - 1;
          const lowerTime = lowerIndex < 0 ? 0 : times[lowerIndex];
          const upperTime = times[upperIndex];
          const upperProp = property[upperTime];

          const upperValue = upperProp.value;
          const upperEase = getEase(upperProp.$ease || '');
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
            getOffset(
              lowerTime,
              upperTime,
              localTime,
              index,
              total,
              upperProp.$stagger || 0,
              upperProp.$delay || 0,
              upperProp.$endDelay || 0
            )
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
      if (playState === IDLE) {
        clearKeys(id, target);
      }
    }
  }
}

function getOffset(
  frameLower: number,
  frameUpper: number,
  localTime: number,
  targetIndex: number,
  targetCount: number,
  stagger: number,
  delay: number,
  endDelay: number
): number {
  let lower = frameLower;
  let upper = frameUpper;
  if (delay) {
    lower += delay;
  }
  if (endDelay) {
    upper -= endDelay;
  }
  if (stagger) {
    // Adjust stagger so the front and end are delayed equal to the stagger.
    const staggerDelay = Math.abs((targetIndex + 1) * stagger);
    const totalDelay = Math.abs(targetCount * stagger);
    lower += staggerDelay;
    upper -= totalDelay - staggerDelay;
  }
  if (localTime <= lower) {
    // Safeguard against offsets less than 0.
    return 0;
  }
  if (localTime >= upper) {
    // Safeguard against offsets greater than 1.
    return 1;
  }
  return (localTime - lower) / (upper - lower);
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

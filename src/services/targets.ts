import { ja } from '../types';

/**
 * Resolves a selector or an at-target.
 * @param config The timeline configuration.
 * @param target The target to resolve.
 */
export function resolveTargets(
  config: ja.TimelineConfig,
  target: string
): Array<{}> {
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

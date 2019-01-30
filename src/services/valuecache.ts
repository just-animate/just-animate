import { ja } from "../types";

const CACHE = "__just_cache";

/**
 * Clear the cache for the target and id.
 * @param id
 * @param target
 */
export function clearKeys(id: string, target: ja.AnimationTarget) {
  if (target[CACHE] && target[CACHE][id]) {
    delete target[CACHE][id];
  }
}

/**
 * Retrieve value against the id, target, and value.
 * @param id
 * @param target
 * @param key
 */
export function retrieveValue(
  id: string,
  target: ja.AnimationTarget,
  key: string
): ja.AnimationValue | undefined {
  if (target[CACHE] && target[CACHE][id]) {
    return target[CACHE][id][key];
  }
}

/**
 * Store the value against the id, target, and propname.
 * @param id
 * @param target
 * @param key
 * @param value
 */
export function storeValue(
  id: string,
  target: ja.AnimationTarget,
  key: string,
  value: ja.AnimationValue
) {
  if (!target[CACHE]) {
    target[CACHE] = {};
  }
  if (!target[CACHE][id]) {
    target[CACHE][id] = {};
  }
  target[CACHE][id][key] = value;
}

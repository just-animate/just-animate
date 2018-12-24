import { AnimationTarget } from '../core/types';
import { mapFlatten } from './lists';
import {
  isArrayLike,
  // isDOM,
  isFunction,
  isObject,
  isString
} from './inspect';
/**
 * Recursively resolves the element source from dom, selector, jquery, array, and function sources
 *
 * @param {ElementSource} source from which to locate elements
 * @returns {Element[]} array of elements found
 */
export function getTargets(target: AnimationTarget): any[] {
  // if is a string, send to plugin for resolation
  return isString(target)
    ? Array.prototype.slice.call(document.querySelectorAll(target as string))
    : // if function, call it and call this function
    isFunction(target)
    ? getTargets((target as { (): AnimationTarget })())
    : // if array or jQuery object, flatten to an array
    // recursively call this function in case of nested elements
    isArrayLike(target)
    ? mapFlatten(target as any[], getTargets)
    : // if it is an actual object at this point, handle it
    isObject(target)
    ? [target]
    : // otherwise return empty
      [];
}

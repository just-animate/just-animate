import { AnimationTarget } from '../types'
import { pushAll, forEach } from './lists'
import { isArrayLike, isDOM, isFunction, isObject, isString } from './type'
import { $ } from './elements'
/**
 * Recursively resolves the element source from dom, selector, jquery, array, and function sources
 * 
 * @param {ElementSource} source from which to locate elements
 * @returns {Element[]} array of elements found
 */
export function getTargets(target: AnimationTarget): (HTMLElement | {})[] {
  if (isString(target)) {
    // if query selector, search for elements
    return $(document, target as string)
  }
  if (isDOM(target)) {
    // if a single element, wrap in array
    return [target]
  }
  if (isFunction(target)) {
    // if function, call it and call this function
    return getTargets((target as { (): AnimationTarget })())
  }
  if (isArrayLike(target)) {
    // if array or jQuery object, flatten to an array
    // recursively call this function in case of nested elements
    const elements: HTMLElement[] = []
    forEach(target as any[], t => pushAll(elements, getTargets(t)))
    return elements
  }
  if (isObject(target)) {
    // if it is an actual object at this point, handle it
    return [target]
  }

  // otherwise return empty
  return []
}

import { AnimationTarget } from '../types'
import { toArray, pushAll } from './lists'
import { isArrayLike, isDOM, isFunction, isObject, isString } from './type'
/**
 * Recursively resolves the element source from dom, selector, jquery, array, and function sources
 * 
 * @param {ElementSource} source from which to locate elements
 * @returns {Element[]} array of elements found
 */
export function getTargets(target: AnimationTarget): (HTMLElement | {})[] {
  if (isString(target)) {
    // if query selector, search for elements
    return toArray(document.querySelectorAll(target as string))
  }
  if (isDOM(target)) {
    // if a single element, wrap in array
    return [target]
  }
  if (isFunction(target)) {
    // if function, call it and call this function
    const provider = target as { (): AnimationTarget }
    const result = provider()
    return getTargets(result)
  }
  if (isArrayLike(target)) {
    // if array or jQuery object, flatten to an array
    const elements: HTMLElement[] = []
    for (let i = 0, ilen = (target as any[]).length; i < ilen; i++) {
      // recursively call this function in case of nested elements
      pushAll(elements, getTargets(target[i]))
    }
    return elements
  }
  if (isObject(target)) {
    // if it is an actual object at this point, handle it
    return [target] as {}[]
  }

  // otherwise return empty
  return []
}

import { toArray } from './lists';
import { isArray, isElement, isFunction, isObject, isString } from './type';
import { invalidArg } from './errors';

/**
 * Recursively resolves the element source from dom, selector, jquery, array, and function sources
 * 
 * @param {ja.ElementSource} source from which to locate elements
 * @returns {Element[]} array of elements found
 */
export function getTargets(target: ja.AnimationTarget): (Element | {})[] {
    if (!target) {
        throw invalidArg('source');
    }
    if (isString(target)) {
        // if query selector, search for elements 
        return toArray(document.querySelectorAll(target as string));
    }
    if (isElement(target)) {
        // if a single element, wrap in array 
        return [target] as Element[];
    }
    if (isFunction(target)) {
        // if function, call it and call this function
        const provider = target as { (): ja.AnimationTarget; };
        const result = provider();
        return getTargets(result);
    }
    if (isArray(target)) {
        // if array or jQuery object, flatten to an array
        const elements: Element[] = [];
        for (const i of target as ja.AnimationTarget[]) {
            // recursively call this function in case of nested elements
            const innerElements = getTargets(i);
            elements.push.apply(elements, innerElements);
        }
        return elements;
    }
    if (isObject(target)) {
        // if it is an actual object at this point, handle it
        return [target] as {}[];
    }

    // otherwise return empty    
    return [];
}

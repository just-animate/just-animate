import { toArray } from './lists';
import { isArray, isFunction, isString } from './type';
import { invalidArg } from './errors';

/**
 * Recursively resolves the element source from dom, selector, jquery, array, and function sources
 * 
 * @param {ja.ElementSource} source from which to locate elements
 * @returns {Element[]} array of elements found
 */
export function queryElements(source: ja.AnimationTarget): Element[] {
    if (!source) {
        throw invalidArg('source');
    }
    if (isString(source)) {
        // if query selector, search for elements 
        const nodeResults = document.querySelectorAll(source as string);
        return toArray(nodeResults);
    }
    if (typeof source['tagName'] === 'string') {
        // if a single element, wrap in array 
        return [source] as Element[];
    }
    if (isFunction(source)) {
        // if function, call it and call this function
        const provider = source as { (): ja.AnimationTarget; };
        const result = provider();
        return queryElements(result);
    }
    if (isArray(source)) {
        // if array or jQuery object, flatten to an array
        const elements: Element[] = [];
        for (const i of source as ja.AnimationTarget[]) {
            // recursively call this function in case of nested elements
            const innerElements = queryElements(i);
            elements.push.apply(elements, innerElements);
        }
        return elements;
    }

    // otherwise return empty    
    return [];
}

export function getEmSize(el: HTMLElement): number {
    return parseFloat(getComputedStyle(el).fontSize!);
}


export function getRemSize(): number {
    return parseFloat(getComputedStyle(document.body).fontSize!);
}

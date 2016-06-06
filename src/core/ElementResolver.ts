import {each, isArray, isFunction, isString, toArray} from './Helpers';

/**
 * Recursively resolves the element source from dom, selector, jquery, array, and function sources
 * 
 * @param {ja.ElementSource} source from which to locate elements
 * @returns {Element[]} array of elements found
 */
export function resolveElements(source: ja.ElementSource): Element[] {
    if (!source) {
        throw Error('source is undefined');
    }
    if (isString(source)) {
        // if query selector, search for elements 
        const nodeResults = document.querySelectorAll(source as string);
        return toArray(nodeResults);
    }
    if (source instanceof Element) {
        // if a single element, wrap in array 
        return [source];
    }
    if (isFunction(source)) {
        // if function, call it and call this function
        const provider = source as ja.IElementProvider;
        const result = provider();
        return resolveElements(result);
    }
    if (isArray(source)) {
        // if array or jQuery object, flatten to an array
        const elements: Element[] = [];
        each(source as ja.IIndexed<any>, (i: any) => {
            // recursively call this function in case of nested elements
            const innerElements = resolveElements(i);
            elements.push.apply(elements, innerElements);
        });
        return elements;
    }

    // otherwise return empty    
    return [];
}

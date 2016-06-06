"use strict";
var Helpers_1 = require('./Helpers');
/**
 * Recursively resolves the element source from dom, selector, jquery, array, and function sources
 *
 * @param {ja.ElementSource} source from which to locate elements
 * @returns {Element[]} array of elements found
 */
function resolveElements(source) {
    if (!source) {
        throw Error('source is undefined');
    }
    if (Helpers_1.isString(source)) {
        // if query selector, search for elements 
        var nodeResults = document.querySelectorAll(source);
        return Helpers_1.toArray(nodeResults);
    }
    if (source instanceof Element) {
        // if a single element, wrap in array 
        return [source];
    }
    if (Helpers_1.isFunction(source)) {
        // if function, call it and call this function
        var provider = source;
        var result = provider();
        return resolveElements(result);
    }
    if (Helpers_1.isArray(source)) {
        // if array or jQuery object, flatten to an array
        var elements_1 = [];
        Helpers_1.each(source, function (i) {
            // recursively call this function in case of nested elements
            var innerElements = resolveElements(i);
            elements_1.push.apply(elements_1, innerElements);
        });
        return elements_1;
    }
    // otherwise return empty    
    return [];
}
exports.resolveElements = resolveElements;

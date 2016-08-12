"use strict";
var lists_1 = require('./lists');
var type_1 = require('./type');
var errors_1 = require('./errors');
/**
 * Recursively resolves the element source from dom, selector, jquery, array, and function sources
 *
 * @param {ja.ElementSource} source from which to locate elements
 * @returns {Element[]} array of elements found
 */
function queryElements(source) {
    if (!source) {
        throw errors_1.invalidArg('source');
    }
    if (type_1.isString(source)) {
        // if query selector, search for elements 
        var nodeResults = document.querySelectorAll(source);
        return lists_1.toArray(nodeResults);
    }
    if (typeof source['tagName'] === 'string') {
        // if a single element, wrap in array 
        return [source];
    }
    if (type_1.isFunction(source)) {
        // if function, call it and call this function
        var provider = source;
        var result = provider();
        return queryElements(result);
    }
    if (type_1.isArray(source)) {
        // if array or jQuery object, flatten to an array
        var elements_1 = [];
        lists_1.each(source, function (i) {
            // recursively call this function in case of nested elements
            var innerElements = queryElements(i);
            elements_1.push.apply(elements_1, innerElements);
        });
        return elements_1;
    }
    // otherwise return empty    
    return [];
}
exports.queryElements = queryElements;

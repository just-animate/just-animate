/// <reference path="../just-animate.d.ts" />
"use strict";
var easings_1 = require('../easings');
var helpers_1 = require('./helpers');
/**
 * (description)
 *
 * @export
 * @class ElementAnimator
 * @implements {ja.IAnimator}
 */
var ElementAnimator = (function () {
    /**
     * Creates an instance of ElementAnimator.
     *
     * @param {ja.IAnimationManager} manager (description)
     * @param {(string | ja.IIndexed<ja.IKeyframe>)} keyframesOrName (description)
     * @param {ja.ElementSource} el (description)
     * @param {ja.IAnimationEffectTiming} [timings] (description)
     */
    function ElementAnimator(manager, keyframesOrName, el, timings) {
        var _this = this;
        if (!keyframesOrName) {
            return;
        }
        var keyframes;
        if (helpers_1.isString(keyframesOrName)) {
            // if keyframes is a string, lookup keyframes from registry
            var definition = manager.findAnimation(keyframesOrName);
            keyframes = definition.keyframes;
            // use registered timings as default, then load timings from params           
            timings = helpers_1.extend({}, definition.timings, timings);
        }
        else {
            // otherwise, keyframes are actually keyframes
            keyframes = keyframesOrName;
        }
        if (timings && timings.easing) {
            // if timings contains an easing property, 
            var easing = easings_1.easings[timings.easing];
            if (easing) {
                timings.easing = easing;
            }
        }
        // add duration to object    
        this.duration = timings.duration;
        // get list of elements to animate
        var elements = getElements(el);
        // call .animate on all elements and get a list of their players        
        this._animators = helpers_1.multiapply(elements, 'animate', [keyframes, timings]);
        // hookup finish event for when it happens naturally    
        if (this._animators.length > 0) {
            // todo: try to find a better way than just listening to one of them
            /**
             * (description)
             */
            this._animators[0].onfinish = function () {
                _this.finish();
            };
        }
    }
    Object.defineProperty(ElementAnimator.prototype, "playbackRate", {
        /**
         * (description)
         *
         * @type {number}
         */
        get: function () {
            var first = helpers_1.head(this._animators);
            return first ? first.playbackRate : 0;
        },
        /**
         * (description)
         */
        set: function (val) {
            helpers_1.each(this._animators, function (a) { return a.playbackRate = val; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementAnimator.prototype, "currentTime", {
        /**
         * (description)
         *
         * @type {number}
         */
        get: function () {
            return helpers_1.max(this._animators, 'currentTime') || 0;
        },
        /**
         * (description)
         */
        set: function (elapsed) {
            helpers_1.each(this._animators, function (a) { return a.currentTime = elapsed; });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * (description)
     *
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    ElementAnimator.prototype.finish = function (fn) {
        var _this = this;
        helpers_1.multiapply(this._animators, 'finish', [], fn);
        if (this.playbackRate < 0) {
            helpers_1.each(this._animators, function (a) { return a.currentTime = 0; });
        }
        else {
            helpers_1.each(this._animators, function (a) { return a.currentTime = _this.duration; });
        }
        if (helpers_1.isFunction(this.onfinish)) {
            this.onfinish(this);
        }
        return this;
    };
    /**
     * (description)
     *
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    ElementAnimator.prototype.play = function (fn) {
        helpers_1.multiapply(this._animators, 'play', [], fn);
        return this;
    };
    /**
     * (description)
     *
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    ElementAnimator.prototype.pause = function (fn) {
        helpers_1.multiapply(this._animators, 'pause', [], fn);
        return this;
    };
    /**
     * (description)
     *
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    ElementAnimator.prototype.reverse = function (fn) {
        helpers_1.multiapply(this._animators, 'reverse', [], fn);
        return this;
    };
    /**
     * (description)
     *
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    ElementAnimator.prototype.cancel = function (fn) {
        helpers_1.multiapply(this._animators, 'cancel', [], fn);
        helpers_1.each(this._animators, function (a) { return a.currentTime = 0; });
        if (helpers_1.isFunction(this.oncancel)) {
            this.oncancel(this);
        }
        return this;
    };
    return ElementAnimator;
}());
exports.ElementAnimator = ElementAnimator;
/**
 * (description)
 *
 * @param {ja.ElementSource} source (description)
 * @returns {Element[]} (description)
 */
function getElements(source) {
    if (!source) {
        throw Error('source is undefined');
    }
    if (helpers_1.isString(source)) {
        // if query selector, search for elements 
        var nodeResults = document.querySelectorAll(source);
        return helpers_1.toArray(nodeResults);
    }
    if (source instanceof Element) {
        // if a single element, wrap in array 
        return [source];
    }
    if (helpers_1.isFunction(source)) {
        // if function, call it and call this function
        var provider = source;
        var result = provider();
        return getElements(result);
    }
    if (helpers_1.isArray(source)) {
        // if array or jQuery object, flatten to an array
        var elements_1 = [];
        helpers_1.each(source, function (i) {
            // recursively call this function in case of nested elements
            var innerElements = getElements(i);
            elements_1.push.apply(elements_1, innerElements);
        });
        return elements_1;
    }
    // otherwise return empty    
    return [];
}

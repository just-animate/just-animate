"use strict";
var easings_1 = require('../easings');
var elements_1 = require('../helpers/elements');
var functions_1 = require('../helpers/functions');
var objects_1 = require('../helpers/objects');
var lists_1 = require('../helpers/lists');
var type_1 = require('../helpers/type');
var keyframes_1 = require('../helpers/keyframes');
/**
 * Animates one or more elements
 *
 * @export
 * @class ElementAnimator
 * @implements {ja.IAnimator}
 */
var ElementAnimator = (function () {
    /**
     * Creates an instance of ElementAnimator.
     *
     * @param {ja.IAnimationManager} manager JustAnimate instance
     * @param {(string | ja.IKeyframeOptions[])} keyframesOrName keyframe definition or name of registered animation
     * @param {ja.ElementSource} el element or element source to animate
     * @param {ja.IAnimationEffectTiming} [timings] optional timing overrides.  required when passing in keyframes
     */
    function ElementAnimator(manager, keyframesOrName, el, timings) {
        var _this = this;
        if (!keyframesOrName) {
            return;
        }
        var keyframes;
        if (type_1.isString(keyframesOrName)) {
            // if keyframes is a string, lookup keyframes from registry
            var definition = manager.findAnimation(keyframesOrName);
            keyframes = functions_1.pipe(lists_1.map(definition.keyframes, keyframes_1.normalizeProperties), keyframes_1.spaceKeyframes, keyframes_1.normalizeKeyframes);
            // use registered timings as default, then load timings from params           
            timings = objects_1.extend({}, definition.timings, timings);
        }
        else {
            // otherwise, translate keyframe properties
            keyframes = functions_1.pipe(lists_1.map(keyframesOrName, keyframes_1.normalizeProperties), keyframes_1.spaceKeyframes, keyframes_1.normalizeKeyframes);
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
        var elements = elements_1.queryElements(el);
        // call .animate on all elements and get a list of their players        
        this._animators = functions_1.multiapply(elements, 'animate', [keyframes, timings]);
        // hookup finish event for when it happens naturally    
        if (this._animators.length > 0) {
            // todo: try to find a better way than just listening to one of them
            this._animators[0].onfinish = function () {
                _this.finish();
            };
        }
    }
    Object.defineProperty(ElementAnimator.prototype, "playbackRate", {
        /**
         * Returns 0 when not playing, 1 when playing forward, and -1 when playing backward
         *
         * @type {number}
         */
        get: function () {
            var first = lists_1.head(this._animators);
            return first ? first.playbackRate : 0;
        },
        /**
         * Sets the playbackRate to the specified value
         */
        set: function (val) {
            lists_1.each(this._animators, function (a) { return a.playbackRate = val; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementAnimator.prototype, "currentTime", {
        /**
         * Returns current time of the animation
         *
         * @type {number}
         */
        get: function () {
            return lists_1.max(this._animators, 'currentTime') || 0;
        },
        /**
         * Sets the animation current time
         */
        set: function (elapsed) {
            lists_1.each(this._animators, function (a) { return a.currentTime = elapsed; });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Finishes the current animation
     *
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of the Element Animator
     */
    ElementAnimator.prototype.finish = function (fn) {
        var _this = this;
        functions_1.multiapply(this._animators, 'finish', [], fn);
        if (this.playbackRate < 0) {
            lists_1.each(this._animators, function (a) { return a.currentTime = 0; });
        }
        else {
            lists_1.each(this._animators, function (a) { return a.currentTime = _this.duration; });
        }
        if (type_1.isFunction(this.onfinish)) {
            this.onfinish(this);
        }
        return this;
    };
    /**
     * Plays the animation
     *
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of Element Animator
     */
    ElementAnimator.prototype.play = function (fn) {
        functions_1.multiapply(this._animators, 'play', [], fn);
        return this;
    };
    /**
     * Pauses the animation
     *
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator}  this instance of Element Animator
     */
    ElementAnimator.prototype.pause = function (fn) {
        functions_1.multiapply(this._animators, 'pause', [], fn);
        return this;
    };
    /**
     * Reverses the direction of the animation
     *
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of Element Animator
     */
    ElementAnimator.prototype.reverse = function (fn) {
        functions_1.multiapply(this._animators, 'reverse', [], fn);
        return this;
    };
    /**
     * Cancels the animation
     *
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of Element Animator
     */
    ElementAnimator.prototype.cancel = function (fn) {
        functions_1.multiapply(this._animators, 'cancel', [], fn);
        lists_1.each(this._animators, function (a) { return a.currentTime = 0; });
        if (type_1.isFunction(this.oncancel)) {
            this.oncancel(this);
        }
        return this;
    };
    return ElementAnimator;
}());
exports.ElementAnimator = ElementAnimator;

"use strict";
var lists_1 = require('./helpers/lists');
var ElementAnimator_1 = require('./core/ElementAnimator');
var SequenceAnimator_1 = require('./core/SequenceAnimator');
var TimelineAnimator_1 = require('./core/TimelineAnimator');
/**
 * (description)
 *
 * @export
 * @class JustAnimate
 * @implements {ja.IAnimationManager}
 */
var JustAnimate = (function () {
    function JustAnimate() {
        this._registry = {};
    }
    /**
     * (description)
     *
     * @static
     * @param {ja.IAnimationOptions[]} animations (description)
     */
    JustAnimate.inject = function (animations) {
        lists_1.each(animations, function (a) { return JustAnimate._globalAnimations[a.name] = a; });
    };
    /**
     * (description)
     *
     * @param {(string | ja.IKeyframeOptions[])} keyframesOrName (description)
     * @param {ja.ElementSource} el (description)
     * @param {ja.IAnimationEffectTiming} [timings] (description)
     * @returns {ja.IAnimator} (description)
     */
    JustAnimate.prototype.animate = function (keyframesOrName, el, timings) {
        return new ElementAnimator_1.ElementAnimator(this, keyframesOrName, el, timings);
    };
    /**
     * (description)
     *
     * @param {ja.ISequenceOptions} options (description)
     * @returns {ja.IAnimator} (description)
     */
    JustAnimate.prototype.animateSequence = function (options) {
        return new SequenceAnimator_1.SequenceAnimator(this, options);
    };
    /**
     * (description)
     *
     * @param {ja.ITimelineOptions} options (description)
     * @returns {ja.IAnimator} (description)
     */
    JustAnimate.prototype.animateTimeline = function (options) {
        return new TimelineAnimator_1.TimelineAnimator(this, options);
    };
    /**
     * (description)
     *
     * @param {string} name (description)
     * @returns {ja.IEffectOptions} (description)
     */
    JustAnimate.prototype.findAnimation = function (name) {
        return this._registry[name] || JustAnimate._globalAnimations[name] || undefined;
    };
    /**
     * (description)
     *
     * @param {ja.IAnimationOptions} animationOptions (description)
     * @returns {ja.IAnimationManager} (description)
     */
    JustAnimate.prototype.register = function (animationOptions) {
        this._registry[animationOptions.name] = animationOptions;
    };
    /**
     * Calls global inject function
     *
     * @static
     * @param {ja.IAnimationOptions[]} animations (description)
     */
    JustAnimate.prototype.inject = function (animations) {
        JustAnimate.inject(animations);
    };
    JustAnimate._globalAnimations = {};
    return JustAnimate;
}());
exports.JustAnimate = JustAnimate;

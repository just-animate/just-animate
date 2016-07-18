"use strict";
var lists_1 = require('./helpers/lists');
var WebTransformer_1 = require('./core/WebTransformer');
var ElementAnimator_1 = require('./core/ElementAnimator');
var SequenceAnimator_1 = require('./core/SequenceAnimator');
var TimelineAnimator_1 = require('./core/TimelineAnimator');
var DEFAULT_ANIMATIONS = [];
/**
 * (description)
 *
 * @export
 * @class JustAnimate
 * @implements {ja.IAnimationManager}
 */
var JustAnimate = (function () {
    /**
     * Creates an instance of JustAnimate.
     */
    function JustAnimate() {
        var _this = this;
        this._registry = {};
        lists_1.each(DEFAULT_ANIMATIONS, function (a) { return _this._registry[a.name] = a; });
    }
    /**
     * (description)
     *
     * @static
     * @param {ja.IAnimationOptions[]} animations (description)
     */
    JustAnimate.inject = function (animations) {
        Array.prototype.push.apply(DEFAULT_ANIMATIONS, lists_1.map(animations, WebTransformer_1.animationTransformer));
    };
    /**
     * (description)
     *
     * @param {(string | ja.IIndexed<ja.IKeyframe>)} keyframesOrName (description)
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
     * @returns {ja.IKeyframeOptions} (description)
     */
    JustAnimate.prototype.findAnimation = function (name) {
        return this._registry[name] || undefined;
    };
    /**
     * (description)
     *
     * @param {ja.IAnimationOptions} animationOptions (description)
     * @returns {ja.IAnimationManager} (description)
     */
    JustAnimate.prototype.register = function (animationOptions) {
        this._registry[animationOptions.name] = WebTransformer_1.animationTransformer(animationOptions);
        return this;
    };
    return JustAnimate;
}());
exports.JustAnimate = JustAnimate;

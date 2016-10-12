"use strict";
var lists_1 = require("./common/lists");
var random_1 = require("./common/random");
var Animator_1 = require("./plugins/core/Animator");
var TimeLoop_1 = require("./plugins/core/TimeLoop");
var MixinService_1 = require("./plugins/core/MixinService");
var JustAnimate = (function () {
    function JustAnimate() {
        /**
         * List of supported easing functions
         *
         * @type {ja.EasingList}
         * @memberOf JustAnimate
         */
        this.easings = {
            ease: 'ease',
            easeIn: 'easeIn',
            easeInBack: 'easeInBack',
            easeInCirc: 'easeInCirc',
            easeInCubic: 'easeInCubic',
            easeInExpo: 'easeInExpo',
            easeInOut: 'easeInOut',
            easeInOutBack: 'easeInOutBack',
            easeInOutCirc: 'easeInOutCirc',
            easeInOutCubic: 'easeInOutCubic',
            easeInOutExpo: 'easeInOutExpo',
            easeInOutQuad: 'easeInOutQuad',
            easeInOutQuart: 'easeInOutQuart',
            easeInOutQuint: 'easeInOutQuint',
            easeInOutSine: 'easeInOutSine',
            easeInQuad: 'easeInQuad',
            easeInQuart: 'easeInQuart',
            easeInQuint: 'easeInQuint',
            easeInSine: 'easeInSine',
            easeOut: 'easeOut',
            easeOutBack: 'easeOutBack',
            easeOutCirc: 'easeOutCirc',
            easeOutCubic: 'easeOutCubic',
            easeOutExpo: 'easeOutExpo',
            easeOutQuad: 'easeOutQuad',
            easeOutQuart: 'easeOutQuart',
            easeOutQuint: 'easeOutQuint',
            easeOutSine: 'easeOutSine',
            elegantSlowStartEnd: 'elegantSlowStartEnd',
            linear: 'linear',
            stepEnd: 'stepEnd',
            stepStart: 'stepStart'
        };
        var self = this;
        self._resolver = new MixinService_1.MixinService();
        self._timeLoop = TimeLoop_1.TimeLoop();
        self.plugins = [];
    }
    /**
     * Register a list of mixins across all instances of JustAnimate
     *
     * @static
     * @param {ja.IAnimationMixin[]} animations
     *
     * @memberOf JustAnimate
     */
    JustAnimate.inject = function (animations) {
        var resolver = new MixinService_1.MixinService();
        lists_1.each(animations, function (a) { return resolver.registerAnimation(a, true); });
    };
    /**
     * Returns a new timeline of animation(s) using the options provided
     *
     * @param {(ja.IAnimationOptions | ja.IAnimationOptions[])} options
     * @returns {ja.IAnimator}
     *
     * @memberOf JustAnimate
     */
    JustAnimate.prototype.animate = function (options) {
        return new Animator_1.Animator(this._resolver, this._timeLoop, this.plugins).animate(options);
    };
    /**
     * Generates a random number between the first and last number (exclusive)
     *
     * @param {number} first number; start of range
     * @param {number} last number: end of range
     * @returns {number} at or between the first number until the last number
     *
     * @memberOf JustAnimate
     */
    JustAnimate.prototype.random = function (first, last) {
        return random_1.random(first, last);
    };
    /**
     * Registers a mixin to this instance of JustAnimate.
     *
     * @param {ja.IAnimationMixin} preset
     *
     * @memberOf JustAnimate
     */
    JustAnimate.prototype.register = function (preset) {
        this._resolver.registerAnimation(preset, false);
    };
    /**
     * Returns one of the supplied values at random
     *
     * @template T
     * @param {T[]} choices from which to choose
     * @returns {T} a choice at random
     *
     * @memberOf JustAnimate
     */
    JustAnimate.prototype.shuffle = function (choices) {
        return random_1.shuffle(choices);
    };
    /**
     * Registers a list of mixins across all instances of JustAnimate.  Same as register in a browser environment
     *
     * @param {ja.IAnimationMixin[]} animations
     *
     * @memberOf JustAnimate
     */
    JustAnimate.prototype.inject = function (animations) {
        var resolver = this._resolver;
        lists_1.each(animations, function (a) { return resolver.registerAnimation(a, true); });
    };
    return JustAnimate;
}());
exports.JustAnimate = JustAnimate;

"use strict";
var helpers_1 = require('./core/helpers');
var ElementAnimator_1 = require('./core/ElementAnimator');
var SequenceAnimator_1 = require('./core/SequenceAnimator');
var TimelineAnimator_1 = require('./core/TimelineAnimator');
var DEFAULT_ANIMATIONS = [];
var JustAnimate = (function () {
    function JustAnimate() {
        var _this = this;
        this._timings = {
            duration: 1000,
            fill: 'both'
        };
        this._registry = {};
        helpers_1.each(DEFAULT_ANIMATIONS, function (a) {
            _this._registry[a.name] = a;
        });
    }
    JustAnimate.inject = function (animations) {
        Array.prototype.push.apply(DEFAULT_ANIMATIONS, animations);
    };
    JustAnimate.prototype.animate = function (keyframesOrName, el, timings) {
        return new ElementAnimator_1.ElementAnimator(this, keyframesOrName, el, timings);
    };
    JustAnimate.prototype.animateSequence = function (options) {
        return new SequenceAnimator_1.SequenceAnimator(this, options);
    };
    JustAnimate.prototype.animateTimeline = function (options) {
        return new TimelineAnimator_1.TimelineAnimator(this, options);
    };
    JustAnimate.prototype.findAnimation = function (name) {
        return this._registry[name] || undefined;
    };
    JustAnimate.prototype.register = function (animationOptions) {
        this._registry[animationOptions.name] = animationOptions;
        return this;
    };
    return JustAnimate;
}());
exports.JustAnimate = JustAnimate;

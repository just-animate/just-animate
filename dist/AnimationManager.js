"use strict";
var helpers_1 = require('./app/helpers');
var ElementAnimator_1 = require('./app/ElementAnimator');
var SequenceAnimator_1 = require('./app/SequenceAnimator');
var TimelineAnimator_1 = require('./app/TimelineAnimator');
var DEFAULT_ANIMATIONS = [];
var AnimationManager = (function () {
    function AnimationManager() {
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
    AnimationManager.inject = function (animations) {
        Array.prototype.push.apply(DEFAULT_ANIMATIONS, animations);
    };
    AnimationManager.prototype.animate = function (keyframesOrName, el, timings) {
        return new ElementAnimator_1.ElementAnimator(this, keyframesOrName, el, timings);
    };
    AnimationManager.prototype.animateSequence = function (options) {
        return new SequenceAnimator_1.SequenceAnimator(this, options);
    };
    AnimationManager.prototype.animateTimeline = function (options) {
        return new TimelineAnimator_1.TimelineAnimator(this, options);
    };
    AnimationManager.prototype.findAnimation = function (name) {
        return this._registry[name] || undefined;
    };
    AnimationManager.prototype.register = function (animationOptions) {
        this._registry[animationOptions.name] = animationOptions;
        return this;
    };
    return AnimationManager;
}());
exports.AnimationManager = AnimationManager;

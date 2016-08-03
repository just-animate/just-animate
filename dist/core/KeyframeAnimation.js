"use strict";
var Dispatcher_1 = require('./Dispatcher');
var type_1 = require('../helpers/type');
var KeyframeAnimation = (function () {
    function KeyframeAnimation(target, keyframes, timings) {
        var self = this;
        var dispatcher = Dispatcher_1.createDispatcher();
        var animator = target['animate'](keyframes, timings);
        animator.pause();
        animator['onfinish'] = function () { return dispatcher.trigger('finish'); };
        self._iterationStart = timings.iterationStart || 0;
        self._iterations = timings.iterations || 1;
        self._duration = timings.duration;
        self._startTime = timings.delay || 0;
        self._endTime = (timings.endDelay || 0) + timings.duration;
        self._totalDuration = (timings.delay || 0) + ((timings.iterations || 1) * timings.duration) + (timings.endDelay || 0);
        self._dispatcher = dispatcher;
        self._animator = animator;
    }
    KeyframeAnimation.prototype.currentTime = function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._animator.currentTime;
        }
        self._animator.currentTime = value;
        return self;
    };
    KeyframeAnimation.prototype.playbackRate = function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._animator.playbackRate;
        }
        self._animator.playbackRate = value;
        return self;
    };
    KeyframeAnimation.prototype.playState = function () {
        return this._animator.playState;
    };
    KeyframeAnimation.prototype.iterationStart = function () {
        return this._iterationStart;
    };
    KeyframeAnimation.prototype.iterations = function () {
        return this._iterations;
    };
    KeyframeAnimation.prototype.totalDuration = function () {
        return this._totalDuration;
    };
    KeyframeAnimation.prototype.duration = function () {
        return this._duration;
    };
    KeyframeAnimation.prototype.endTime = function () {
        return this._endTime;
    };
    KeyframeAnimation.prototype.startTime = function () {
        return this._startTime;
    };
    KeyframeAnimation.prototype.off = function (eventName, listener) {
        this._dispatcher.off(eventName, listener);
        return this;
    };
    KeyframeAnimation.prototype.on = function (eventName, listener) {
        this._dispatcher.on(eventName, listener);
        return this;
    };
    KeyframeAnimation.prototype.cancel = function () {
        var self = this;
        self._animator.cancel();
        self._dispatcher.trigger('cancel');
        return self;
    };
    KeyframeAnimation.prototype.reverse = function () {
        var self = this;
        self._animator.reverse();
        self._dispatcher.trigger('reverse');
        return self;
    };
    KeyframeAnimation.prototype.pause = function () {
        var self = this;
        self._animator.pause();
        self._dispatcher.trigger('pause');
        return self;
    };
    KeyframeAnimation.prototype.play = function () {
        var self = this;
        self._animator.play();
        self._dispatcher.trigger('play');
        return self;
    };
    KeyframeAnimation.prototype.finish = function () {
        var self = this;
        self._animator.finish();
        return self;
    };
    return KeyframeAnimation;
}());
exports.KeyframeAnimation = KeyframeAnimation;

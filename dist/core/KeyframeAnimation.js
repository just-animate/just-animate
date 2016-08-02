"use strict";
var Dispatcher_1 = require('./Dispatcher');
var KeyframeAnimation = (function () {
    function KeyframeAnimation(target, keyframes, timings) {
        var dispatcher = new Dispatcher_1.Dispatcher();
        var animator = target['animate'](keyframes, timings);
        animator.pause();
        animator['onfinish'] = function () { return dispatcher.trigger('finish'); };
        this._iterationStart = timings.iterationStart || 0;
        this._iterations = timings.iterations || 1;
        this._duration = timings.duration;
        this._startTime = timings.delay || 0;
        this._endTime = (timings.endDelay || 0) + timings.duration;
        this._totalDuration = (timings.delay || 0) + ((timings.iterations || 1) * timings.duration) + (timings.endDelay || 0);
        this._dispatcher = dispatcher;
        this._animator = animator;
    }
    Object.defineProperty(KeyframeAnimation.prototype, "currentTime", {
        get: function () {
            return this._animator.currentTime;
        },
        set: function (value) {
            this._animator.currentTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyframeAnimation.prototype, "playbackRate", {
        get: function () {
            return this._animator.playbackRate;
        },
        set: function (value) {
            this._animator.playbackRate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyframeAnimation.prototype, "playState", {
        get: function () {
            return this._animator.playState;
        },
        set: function (value) {
            this._animator.playState = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyframeAnimation.prototype, "iterationStart", {
        get: function () {
            return this._iterationStart;
        },
        set: function (value) {
            this._iterationStart = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyframeAnimation.prototype, "iterations", {
        get: function () {
            return this._iterations;
        },
        set: function (value) {
            this._iterations = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyframeAnimation.prototype, "totalDuration", {
        get: function () {
            return this._totalDuration;
        },
        set: function (value) {
            this._totalDuration = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyframeAnimation.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        set: function (value) {
            this._duration = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyframeAnimation.prototype, "endTime", {
        get: function () {
            return this._endTime;
        },
        set: function (value) {
            this._endTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyframeAnimation.prototype, "startTime", {
        get: function () {
            return this._startTime;
        },
        set: function (value) {
            this._startTime = value;
        },
        enumerable: true,
        configurable: true
    });
    KeyframeAnimation.prototype.off = function (eventName, listener) {
        this._dispatcher.off(eventName, listener);
        return this;
    };
    KeyframeAnimation.prototype.on = function (eventName, listener) {
        this._dispatcher.on(eventName, listener);
        return this;
    };
    KeyframeAnimation.prototype.cancel = function () {
        this._animator.cancel();
        this._dispatcher.trigger('cancel');
        return this;
    };
    KeyframeAnimation.prototype.reverse = function () {
        this._animator.reverse();
        this._dispatcher.trigger('reverse');
        return this;
    };
    KeyframeAnimation.prototype.pause = function () {
        this._animator.pause();
        this._dispatcher.trigger('pause');
        return this;
    };
    KeyframeAnimation.prototype.play = function () {
        this._animator.play();
        this._dispatcher.trigger('play');
        return this;
    };
    KeyframeAnimation.prototype.finish = function () {
        this._animator.finish();
        return this;
    };
    return KeyframeAnimation;
}());
exports.KeyframeAnimation = KeyframeAnimation;

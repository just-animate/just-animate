"use strict";
var Dispatcher_1 = require('./Dispatcher');
var type_1 = require('../helpers/type');
var keyframeAnimationPrototype = {
    _dispatcher: undefined,
    _duration: undefined,
    _endTime: undefined,
    _iterationStart: undefined,
    _iterations: undefined,
    _startTime: undefined,
    _totalDuration: undefined,
    currentTime: function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._animator.currentTime;
        }
        self._animator.currentTime = value;
        return self;
    },
    playbackRate: function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._animator.playbackRate;
        }
        self._animator.playbackRate = value;
        return self;
    },
    playState: function () {
        return this._animator.playState;
    },
    iterationStart: function () {
        return this._iterationStart;
    },
    iterations: function () {
        return this._iterations;
    },
    totalDuration: function () {
        return this._totalDuration;
    },
    duration: function () {
        return this._duration;
    },
    endTime: function () {
        return this._endTime;
    },
    startTime: function () {
        return this._startTime;
    },
    off: function (eventName, listener) {
        this._dispatcher.off(eventName, listener);
        return this;
    },
    on: function (eventName, listener) {
        this._dispatcher.on(eventName, listener);
        return this;
    },
    cancel: function () {
        var self = this;
        self._animator.cancel();
        self._dispatcher.trigger('cancel');
        return self;
    },
    reverse: function () {
        var self = this;
        self._animator.reverse();
        self._dispatcher.trigger('reverse');
        return self;
    },
    pause: function () {
        var self = this;
        self._animator.pause();
        self._dispatcher.trigger('pause');
        return self;
    },
    play: function () {
        var self = this;
        self._animator.play();
        self._dispatcher.trigger('play');
        return self;
    },
    finish: function () {
        var self = this;
        self._animator.finish();
        return self;
    }
};
function createKeyframeAnimation(target, keyframes, timings) {
    var self = Object.create(keyframeAnimationPrototype);
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
    return self;
}
exports.createKeyframeAnimation = createKeyframeAnimation;

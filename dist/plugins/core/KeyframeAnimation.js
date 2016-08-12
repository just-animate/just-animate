"use strict";
var type_1 = require('../../common/type');
var objects_1 = require('../../common/objects');
var resources_1 = require('../../common/resources');
var Dispatcher_1 = require('./Dispatcher');
function KeyframeAnimation(target, keyframes, options) {
    var self = this instanceof KeyframeAnimation ? this : Object.create(KeyframeAnimation.prototype);
    var duration = options.to - options.from;
    self._iterationStart = objects_1.unwrap(options.iterationStart) || 0;
    self._iterations = objects_1.unwrap(options.iterations) || 1;
    self._duration = duration;
    self._startTime = options.from || 0;
    self._endTime = options.to;
    self._totalDuration = (self._iterations || 1) * duration;
    var dispatcher = Dispatcher_1.Dispatcher();
    self._dispatcher = dispatcher;
    var animator = target[resources_1.animate](keyframes, {
        delay: objects_1.unwrap(options.delay) || undefined,
        direction: objects_1.unwrap(options.direction),
        duration: duration,
        easing: options.easing || 'linear',
        fill: options.fill || 'none',
        iterationStart: self._iterationStart,
        iterations: self._iterations
    });
    // immediately cancel to prevent effects until play is called    
    animator.cancel();
    animator['onfinish'] = function () { return dispatcher.trigger(resources_1.finish); };
    self._animator = animator;
    return self;
}
exports.KeyframeAnimation = KeyframeAnimation;
KeyframeAnimation.prototype = {
    _dispatcher: resources_1.nil,
    _duration: resources_1.nil,
    _endTime: resources_1.nil,
    _iterationStart: resources_1.nil,
    _iterations: resources_1.nil,
    _startTime: resources_1.nil,
    _totalDuration: resources_1.nil,
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
        self._dispatcher.trigger(resources_1.cancel);
        return self;
    },
    reverse: function () {
        var self = this;
        self._animator.reverse();
        self._dispatcher.trigger(resources_1.reverse);
        return self;
    },
    pause: function () {
        var self = this;
        self._animator.pause();
        self._dispatcher.trigger(resources_1.pause);
        return self;
    },
    play: function () {
        var self = this;
        self._animator.play();
        self._dispatcher.trigger(resources_1.play);
        return self;
    },
    finish: function () {
        var self = this;
        self._animator.finish();
        return self;
    }
};

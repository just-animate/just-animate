"use strict";
var lists_1 = require('../../common/lists');
var objects_1 = require('../../common/objects');
var type_1 = require('../../common/type');
var math_1 = require('../../common/math');
var errors_1 = require('../../common/errors');
var resources_1 = require('../../common/resources');
var Dispatcher_1 = require('./Dispatcher');
var easings_1 = require('../../common/easings');
// todo: remove these imports as soon as possible
// fixme!: this controls the amount of time left before the timeline gives up 
// on individual animation and calls finish.  If an animation plays after its time, it looks
// like it restarts and that causes jank
var animationPadding = 1.0 / 30;
var Animator = (function () {
    function Animator(resolver, timeloop, plugins) {
        var self = this;
        if (!type_1.isDefined(resources_1.duration)) {
            throw errors_1.invalidArg(resources_1.duration);
        }
        self._duration = 0;
        self._currentTime = resources_1.nil;
        self._playState = 'idle';
        self._playbackRate = 1;
        self._events = [];
        self._resolver = resolver;
        self._timeLoop = timeloop;
        self._plugins = plugins;
        self._dispatcher = Dispatcher_1.Dispatcher();
        self._onTick = self._onTick.bind(self);
        self.on(resources_1.finish, self._onFinish);
        self.on(resources_1.cancel, self._onCancel);
        self.on(resources_1.pause, self._onPause);
        // autoplay    
        self.play();
        return self;
    }
    Animator.prototype.animate = function (options) {
        var self = this;
        if (type_1.isArray(options)) {
            lists_1.each(options, function (e) { return self._addEvent(e); });
        }
        else {
            self._addEvent(options);
        }
        self._recalculate();
        return self;
    };
    Animator.prototype.duration = function () {
        return this._duration;
    };
    Animator.prototype.currentTime = function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._currentTime;
        }
        self._currentTime = value;
        return self;
    };
    Animator.prototype.playbackRate = function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._playbackRate;
        }
        self._playbackRate = value;
        return self;
    };
    Animator.prototype.playState = function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._playState;
        }
        self._playState = value;
        self._dispatcher.trigger('set', ['playbackState', value]);
        return self;
    };
    Animator.prototype.on = function (eventName, listener) {
        var self = this;
        self._dispatcher.on(eventName, listener);
        return self;
    };
    Animator.prototype.off = function (eventName, listener) {
        var self = this;
        self._dispatcher.off(eventName, listener);
        return self;
    };
    Animator.prototype.finish = function () {
        var self = this;
        self._dispatcher.trigger(resources_1.finish, [self]);
        return self;
    };
    Animator.prototype.play = function () {
        var self = this;
        if (self._playState !== 'running' || self._playState !== 'pending') {
            self._playState = 'pending';
            self._timeLoop.on(self._onTick);
        }
        return self;
    };
    Animator.prototype.pause = function () {
        var self = this;
        self._dispatcher.trigger(resources_1.pause, [self]);
        return self;
    };
    Animator.prototype.reverse = function () {
        var self = this;
        self._playbackRate *= -1;
        return self;
    };
    Animator.prototype.cancel = function () {
        var self = this;
        self._dispatcher.trigger(resources_1.cancel, [self]);
        return self;
    };
    Animator.prototype._recalculate = function () {
        var self = this;
        var endsAt = lists_1.maxBy(self._events, function (e) { return e.startTimeMs + e.animator.totalDuration(); });
        self._duration = endsAt;
    };
    Animator.prototype._addEvent = function (event) {
        var self = this;
        if (event.name) {
            var def = self._resolver.findAnimation(event.name);
            if (!type_1.isDefined(def)) {
                throw errors_1.invalidArg('name');
            }
            objects_1.inherit(event, def);
        }
        event.from = (event.from || 0) + this._duration;
        event.to = (event.to || 0) + this._duration;
        if (!event.easing) {
            event.easing = 'linear';
        }
        else {
            event.easing = easings_1.easings[event.easing] || event.easing;
        }
        lists_1.each(this._plugins, function (plugin) {
            if (plugin.canHandle(event)) {
                var animators = plugin.handle(event);
                var events = lists_1.map(animators, function (animator) {
                    return {
                        animator: animator,
                        endTimeMs: event.from + animator.totalDuration(),
                        startTimeMs: event.from
                    };
                });
                lists_1.pushAll(self._events, events);
            }
        });
    };
    Animator.prototype._onCancel = function (self) {
        self._timeLoop.off(self._onTick);
        self._currentTime = 0;
        self._playState = 'idle';
        lists_1.each(self._events, function (evt) { evt.animator.cancel(); });
    };
    Animator.prototype._onFinish = function (self) {
        self._timeLoop.off(self._onTick);
        self._currentTime = 0;
        self._playState = 'finished';
        lists_1.each(self._events, function (evt) { evt.animator.finish(); });
    };
    Animator.prototype._onPause = function (self) {
        self._timeLoop.off(self._onTick);
        self._playState = 'paused';
        lists_1.each(self._events, function (evt) { evt.animator.pause(); });
    };
    Animator.prototype._onTick = function (delta, runningTime) {
        var self = this;
        var dispatcher = self._dispatcher;
        var playState = self._playState;
        // canceled
        if (playState === 'idle') {
            dispatcher.trigger(resources_1.cancel, [self]);
            return;
        }
        // finished
        if (playState === 'finished') {
            dispatcher.trigger(resources_1.finish, [self]);
            return;
        }
        // paused
        if (playState === 'paused') {
            dispatcher.trigger(resources_1.pause, [self]);
            return;
        }
        // running/pending
        var playbackRate = self._playbackRate;
        var isReversed = playbackRate < 0;
        // calculate running range
        var duration1 = self._duration;
        var startTime = isReversed ? duration1 : 0;
        var endTime = isReversed ? 0 : duration1;
        if (self._playState === 'pending') {
            var currentTime_1 = self._currentTime;
            self._currentTime = currentTime_1 === resources_1.nil || currentTime_1 === endTime ? startTime : currentTime_1;
            self._playState = 'running';
        }
        // calculate currentTime from delta
        var currentTime = self._currentTime + delta * playbackRate;
        self._currentTime = currentTime;
        // check if animation has finished
        if (!math_1.inRange(currentTime, startTime, endTime)) {
            dispatcher.trigger(resources_1.finish, [self]);
            return;
        }
        // start animations if should be active and currently aren't   
        var events = self._events;
        var eventLength = events.length;
        for (var i = 0; i < eventLength; i++) {
            var evt = events[i];
            var startTimeMs = playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
            var endTimeMs = playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
            var shouldBeActive = startTimeMs <= currentTime && currentTime < endTimeMs;
            if (shouldBeActive) {
                var animator = evt.animator;
                animator.playbackRate(playbackRate);
                animator.play();
            }
        }
    };
    return Animator;
}());
exports.Animator = Animator;

"use strict";
var lists_1 = require('../helpers/lists');
var objects_1 = require('../helpers/objects');
var type_1 = require('../helpers/type');
var math_1 = require('../helpers/math');
var elements_1 = require('../helpers/elements');
var Dispatcher_1 = require('./Dispatcher');
var KeyframeAnimation_1 = require('./KeyframeAnimation');
var errors_1 = require('../helpers/errors');
var functions_1 = require('../helpers/functions');
var resources_1 = require('../helpers/resources');
var resources_2 = require('../helpers/resources');
var easings_1 = require('./easings');
var keyframes_1 = require('../helpers/keyframes');
// fixme!: this controls the amount of time left before the timeline gives up 
// on individual animation and calls finish.  If an animation plays after its time, it looks
// like it restarts and that causes jank
var animationPadding = 1.0 / 30;
var TimelineAnimator = (function () {
    function TimelineAnimator(resolver, timeloop) {
        if (!type_1.isDefined(resources_1.duration)) {
            throw errors_1.invalidArg(resources_1.duration);
        }
        var self = this;
        self._currentTime = resources_2.nothing;
        self._iterationStart = 0;
        self._iterations = 1;
        self._lastTick = resources_2.nothing;
        self._playState = 'idle';
        self._playbackRate = 1;
        self._startTime = 0;
        self._resolver = resolver;
        self._timeLoop = timeloop;
        self._dispatcher = Dispatcher_1.Dispatcher();
        self._onTick = self._onTick.bind(self);
        self.on(resources_1.finish, self._onFinish);
        self.on(resources_1.cancel, self._onCancel);
        self.on(resources_1.pause, self._onPause);
    }
    TimelineAnimator.prototype.animate = function (options) {
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
    TimelineAnimator.prototype.duration = function () {
        return this._duration;
    };
    TimelineAnimator.prototype.iterationStart = function () {
        return this._iterationStart;
    };
    TimelineAnimator.prototype.iterations = function () {
        return this._iterations;
    };
    TimelineAnimator.prototype.totalDuration = function () {
        return this._totalDuration;
    };
    TimelineAnimator.prototype.endTime = function () {
        return this._endTime;
    };
    TimelineAnimator.prototype.startTime = function () {
        return this._startTime;
    };
    TimelineAnimator.prototype.currentTime = function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._currentTime;
        }
        self._currentTime = value;
        return self;
    };
    TimelineAnimator.prototype.playbackRate = function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._playbackRate;
        }
        self._playbackRate = value;
        return self;
    };
    TimelineAnimator.prototype.playState = function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._playState;
        }
        self._playState = value;
        self._dispatcher.trigger('set', ['playbackState', value]);
        return self;
    };
    TimelineAnimator.prototype.on = function (eventName, listener) {
        var self = this;
        self._dispatcher.on(eventName, listener);
        return self;
    };
    TimelineAnimator.prototype.off = function (eventName, listener) {
        var self = this;
        self._dispatcher.off(eventName, listener);
        return self;
    };
    TimelineAnimator.prototype.finish = function () {
        var self = this;
        self._dispatcher.trigger(resources_1.finish, [self]);
        return self;
    };
    TimelineAnimator.prototype.play = function () {
        var self = this;
        if (self._playState !== 'running' || self._playState !== 'pending') {
            self._playState = 'pending';
            self._timeLoop.on(self._onTick);
        }
        return self;
    };
    TimelineAnimator.prototype.pause = function () {
        var self = this;
        self._dispatcher.trigger(resources_1.pause, [self]);
        return self;
    };
    TimelineAnimator.prototype.reverse = function () {
        var self = this;
        self._playbackRate *= -1;
        return self;
    };
    TimelineAnimator.prototype.cancel = function () {
        var self = this;
        self._dispatcher.trigger(resources_1.cancel, [self]);
        return self;
    };
    TimelineAnimator.prototype._recalculate = function () {
        var self = this;
        var endsAt = lists_1.maxBy(self._events, function (e) { return e.endTimeMs; });
        self._endTime = endsAt;
        self._duration = endsAt;
        self._totalDuration = endsAt;
    };
    TimelineAnimator.prototype._addEvent = function (event) {
        var targets = elements_1.queryElements(event.targets);
        var fromTime = event.from || this._duration;
        var toTime = event.to;
        if (event.name) {
            var def = this._resolver.findAnimation(event.name);
            if (!type_1.isDefined(def)) {
                throw errors_1.invalidArg('name');
            }
            objects_1.inherit(event, def);
        }
        event.easing = (event.easing && easings_1.easings[event.easing]) || 'linear';
        if (event.keyframes) {
            var keyframes_2 = functions_1.pipe(lists_1.map(event.keyframes, keyframes_1.normalizeProperties), keyframes_1.spaceKeyframes, keyframes_1.normalizeKeyframes);
            var animators = lists_1.map(targets, function (e) {
                return {
                    animator: KeyframeAnimation_1.KeyframeAnimation(e, keyframes_2, event),
                    endTimeMs: toTime,
                    startTimeMs: fromTime
                };
            });
            lists_1.pushAll(this._events, animators);
        }
    };
    TimelineAnimator.prototype._onCancel = function (self) {
        self._timeLoop.off(self._onTick);
        self._currentTime = 0;
        self._playState = 'idle';
        self._lastTick = resources_2.nothing;
        lists_1.each(self._events, function (evt) { evt.animator.cancel(); });
    };
    TimelineAnimator.prototype._onFinish = function (self) {
        self._timeLoop.off(self._onTick);
        self._currentTime = 0;
        self._playState = 'finished';
        self._lastTick = resources_2.nothing;
        lists_1.each(self._events, function (evt) { evt.animator.finish(); });
    };
    TimelineAnimator.prototype._onPause = function (self) {
        self._timeLoop.off(self._onTick);
        self._playState = 'paused';
        self._lastTick = resources_2.nothing;
        lists_1.each(self._events, function (evt) { evt.animator.pause(); });
    };
    TimelineAnimator.prototype._onTick = function (delta2, runningTime2) {
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
            self._currentTime = currentTime_1 === resources_2.nothing || currentTime_1 === endTime ? startTime : currentTime_1;
            self._playState = 'running';
        }
        // calculate currentTime from delta
        var thisTick = performance.now();
        var lastTick = self._lastTick;
        if (lastTick !== resources_2.nothing) {
            var delta = (thisTick - lastTick) * playbackRate;
            self._currentTime += delta;
        }
        self._lastTick = thisTick;
        var currentTime = self._currentTime;
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
    return TimelineAnimator;
}());
exports.TimelineAnimator = TimelineAnimator;
;

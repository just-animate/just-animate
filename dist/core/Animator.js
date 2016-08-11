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
function Animator(resolver, timeloop) {
    var self = this instanceof Animator ? this : Object.create(Animator.prototype);
    if (!type_1.isDefined(resources_1.duration)) {
        throw errors_1.invalidArg(resources_1.duration);
    }
    self._duration = 0;
    self._totalDuration = 0;
    self._currentTime = resources_2.nothing;
    self._iterationStart = 0;
    self._iterations = 1;
    self._lastTick = resources_2.nothing;
    self._playState = 'idle';
    self._playbackRate = 1;
    self._startTime = 0;
    self._events = [];
    self._resolver = resolver;
    self._timeLoop = timeloop;
    self._dispatcher = Dispatcher_1.Dispatcher();
    self._onTick = self._onTick.bind(self);
    self.on(resources_1.finish, self._onFinish);
    self.on(resources_1.cancel, self._onCancel);
    self.on(resources_1.pause, self._onPause);
    return self;
}
exports.Animator = Animator;
Animator.prototype = {
    _currentTime: resources_2.nothing,
    _dispatcher: resources_2.nothing,
    _duration: resources_2.nothing,
    _endTime: resources_2.nothing,
    _events: resources_2.nothing,
    _iterationStart: resources_2.nothing,
    _iterations: resources_2.nothing,
    _lastTick: resources_2.nothing,
    _playState: resources_2.nothing,
    _playbackRate: resources_2.nothing,
    _resolver: resources_2.nothing,
    _startTime: resources_2.nothing,
    _timeLoop: resources_2.nothing,
    _totalDuration: resources_2.nothing,
    animate: function (options) {
        var self = this;
        if (type_1.isArray(options)) {
            lists_1.each(options, function (e) { return self._addEvent(e); });
        }
        else {
            self._addEvent(options);
        }
        self._recalculate();
        return self;
    },
    duration: function () {
        return this._duration;
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
    endTime: function () {
        return this._endTime;
    },
    startTime: function () {
        return this._startTime;
    },
    currentTime: function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._currentTime;
        }
        self._currentTime = value;
        return self;
    },
    playbackRate: function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._playbackRate;
        }
        self._playbackRate = value;
        return self;
    },
    playState: function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._playState;
        }
        self._playState = value;
        self._dispatcher.trigger('set', ['playbackState', value]);
        return self;
    },
    on: function (eventName, listener) {
        var self = this;
        self._dispatcher.on(eventName, listener);
        return self;
    },
    off: function (eventName, listener) {
        var self = this;
        self._dispatcher.off(eventName, listener);
        return self;
    },
    finish: function () {
        var self = this;
        self._dispatcher.trigger(resources_1.finish, [self]);
        return self;
    },
    play: function () {
        var self = this;
        if (self._playState !== 'running' || self._playState !== 'pending') {
            self._playState = 'pending';
            self._timeLoop.on(self._onTick);
        }
        return self;
    },
    pause: function () {
        var self = this;
        self._dispatcher.trigger(resources_1.pause, [self]);
        return self;
    },
    reverse: function () {
        var self = this;
        self._playbackRate *= -1;
        return self;
    },
    cancel: function () {
        var self = this;
        self._dispatcher.trigger(resources_1.cancel, [self]);
        return self;
    },
    _recalculate: function () {
        var self = this;
        var endsAt = lists_1.maxBy(self._events, function (e) { return e.startTimeMs + e.animator.totalDuration(); });
        self._endTime = endsAt;
        self._duration = endsAt;
        self._totalDuration = endsAt;
    },
    _addEvent: function (event) {
        var self = this;
        var targets = elements_1.queryElements(event.targets);
        if (event.name) {
            var def = self._resolver.findAnimation(event.name);
            if (!type_1.isDefined(def)) {
                throw errors_1.invalidArg('name');
            }
            objects_1.inherit(event, def);
        }
        event.from = event.from || 0;
        event.to = event.to || 0;
        if (!event.easing) {
            event.easing = 'linear';
        }
        else {
            event.easing = easings_1.easings[event.easing] || event.easing;
        }
        var animators = lists_1.map(targets, function (e) {
            var to = event.to + self._duration;
            var from = event.from + self._duration;
            var expanded = lists_1.map(event.keyframes, objects_1.expand);
            var normalized = lists_1.map(expanded, keyframes_1.normalizeProperties);
            var keyframes = functions_1.pipe(normalized, keyframes_1.spaceKeyframes, keyframes_1.normalizeKeyframes);
            return {
                animator: KeyframeAnimation_1.KeyframeAnimation(e, keyframes, event),
                endTimeMs: to,
                startTimeMs: from
            };
        });
        lists_1.pushAll(self._events, animators);
    },
    _onCancel: function (self) {
        self._timeLoop.off(self._onTick);
        self._currentTime = 0;
        self._playState = 'idle';
        self._lastTick = resources_2.nothing;
        lists_1.each(self._events, function (evt) { evt.animator.cancel(); });
    },
    _onFinish: function (self) {
        self._timeLoop.off(self._onTick);
        self._currentTime = 0;
        self._playState = 'finished';
        self._lastTick = resources_2.nothing;
        lists_1.each(self._events, function (evt) { evt.animator.finish(); });
    },
    _onPause: function (self) {
        self._timeLoop.off(self._onTick);
        self._playState = 'paused';
        self._lastTick = resources_2.nothing;
        lists_1.each(self._events, function (evt) { evt.animator.pause(); });
    },
    _onTick: function (delta2, runningTime2) {
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
    }
};

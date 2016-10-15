"use strict";
var lists_1 = require("../../common/lists");
var objects_1 = require("../../common/objects");
var type_1 = require("../../common/type");
var math_1 = require("../../common/math");
var errors_1 = require("../../common/errors");
var resources_1 = require("../../common/resources");
var Dispatcher_1 = require("./Dispatcher");
var easings_1 = require("./easings");
var units_1 = require("../../common/units");
var elements_1 = require("../../common/elements");
// todo: remove these imports as soon as possible
// fixme!: this controls the amount of time left before the timeline gives up 
// on individual animation and calls finish.  If an animation plays after its time, it looks
// like it restarts and that causes jank
var animationPadding = 1.0 / 30;
var unitOut = units_1.Unit();
var Animator = (function () {
    function Animator(resolver, timeloop, plugins) {
        var self = this;
        if (!type_1.isDefined(resources_1.duration)) {
            throw errors_1.invalidArg(resources_1.duration);
        }
        self._context = {};
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
            for (var _i = 0, _a = options; _i < _a.length; _i++) {
                var e = _a[_i];
                self._addEvent(e);
            }
        }
        else {
            self._addEvent(options);
        }
        self._recalculate();
        return self;
    };
    Animator.prototype.cancel = function () {
        var self = this;
        self._dispatcher.trigger(resources_1.cancel, [self]);
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
    Animator.prototype.finish = function () {
        var self = this;
        self._dispatcher.trigger(resources_1.finish, [self]);
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
    Animator.prototype.off = function (eventName, listener) {
        var self = this;
        self._dispatcher.off(eventName, listener);
        return self;
    };
    Animator.prototype.on = function (eventName, listener) {
        var self = this;
        self._dispatcher.on(eventName, listener);
        return self;
    };
    Animator.prototype.pause = function () {
        var self = this;
        self._dispatcher.trigger(resources_1.pause, [self]);
        return self;
    };
    Animator.prototype.play = function () {
        var self = this;
        if (!(self._playState === 'running' || self._playState === 'pending')) {
            self._playState = 'pending';
            self._timeLoop.on(self._onTick);
        }
        return self;
    };
    Animator.prototype.reverse = function () {
        var self = this;
        self._playbackRate *= -1;
        return self;
    };
    Animator.prototype._recalculate = function () {
        var self = this;
        self._duration = lists_1.maxBy(self._events, function (e) { return e.startTimeMs + e.animator.totalDuration; });
    };
    Animator.prototype._addEvent = function (options) {
        var self = this;
        // resolve mixin properties     
        var event;
        if (options.mixins) {
            var mixinTarget = lists_1.chain(options.mixins)
                .map(function (mixin) {
                var def = self._resolver.findAnimation(mixin);
                if (!type_1.isDefined(def)) {
                    throw errors_1.invalidArg('mixin');
                }
                return def;
            })
                .reduce(function (c, n) { return objects_1.deepCopyObject(n, c); });
            event = objects_1.inherit(options, mixinTarget);
        }
        else {
            event = options;
        }
        // set from and to relative to existing duration    
        units_1.fromTime(event.from || 0, unitOut);
        event.from = unitOut.value + self._duration;
        units_1.fromTime(event.to || 0, unitOut);
        event.to = unitOut.value + self._duration;
        // set easing to linear by default     
        var easingFn = easings_1.getEasingFunction(event.easing);
        event.easing = easings_1.getEasingString(event.easing);
        for (var _i = 0, _a = self._plugins; _i < _a.length; _i++) {
            var plugin = _a[_i];
            if (plugin.canHandle(event)) {
                var targets = elements_1.queryElements(event.targets);
                for (var i = 0, len = targets.length; i < len; i++) {
                    var target = targets[i];
                    var animator = plugin.handle({
                        index: i,
                        options: event,
                        target: target,
                        targets: targets
                    });
                    self._events.push({
                        animator: animator,
                        easingFn: easingFn,
                        endTimeMs: event.from + animator.totalDuration,
                        index: i,
                        startTimeMs: event.from,
                        target: target,
                        targets: targets
                    });
                }
            }
        }
    };
    Animator.prototype._onCancel = function (self) {
        self._timeLoop.off(self._onTick);
        self._currentTime = 0;
        self._playState = 'idle';
        for (var _i = 0, _a = self._events; _i < _a.length; _i++) {
            var evt = _a[_i];
            evt.animator.playState('idle');
        }
    };
    Animator.prototype._onFinish = function (self) {
        self._timeLoop.off(self._onTick);
        self._currentTime = 0;
        self._playState = 'finished';
        for (var _i = 0, _a = self._events; _i < _a.length; _i++) {
            var evt = _a[_i];
            evt.animator.playState('finished');
        }
    };
    Animator.prototype._onPause = function (self) {
        self._timeLoop.off(self._onTick);
        self._playState = 'paused';
        for (var _i = 0, _a = self._events; _i < _a.length; _i++) {
            var evt = _a[_i];
            evt.animator.playState('paused');
        }
    };
    Animator.prototype._onTick = function (delta, runningTime) {
        var self = this;
        var dispatcher = self._dispatcher;
        var playState = self._playState;
        var context = self._context;
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
        for (var _i = 0, _a = self._events; _i < _a.length; _i++) {
            var evt = _a[_i];
            var startTimeMs = playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
            var endTimeMs = playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
            var shouldBeActive = startTimeMs <= currentTime && currentTime <= endTimeMs;
            if (shouldBeActive) {
                var animator = evt.animator;
                var controllerState = animator.playState();
                if (controllerState === 'fatal') {
                    dispatcher.trigger(resources_1.cancel, [self]);
                    return;
                }
                if (controllerState !== 'running') {
                    animator.playbackRate(playbackRate);
                    animator.playState('running');
                }
                animator.playbackRate(playbackRate);
                if (animator.onupdate) {
                    // calculate relative timing properties
                    var relativeDuration = evt.endTimeMs - evt.startTimeMs;
                    var relativeCurrentTime = currentTime - evt.startTimeMs;
                    var timeOffset = relativeCurrentTime / relativeDuration;
                    // set context object values for this update cycle            
                    context.currentTime = relativeCurrentTime;
                    context.delta = delta;
                    context.duration = relativeDuration;
                    context.offset = timeOffset;
                    context.playbackRate = playbackRate;
                    context.computedOffset = evt.easingFn(timeOffset);
                    context.target = evt.target;
                    context.targets = evt.targets;
                    context.index = evt.index;
                    animator.onupdate(context);
                }
            }
        }
    };
    return Animator;
}());
exports.Animator = Animator;

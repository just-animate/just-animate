"use strict";
var lists_1 = require('../helpers/lists');
var type_1 = require('../helpers/type');
var elements_1 = require('../helpers/elements');
var Dispatcher_1 = require('./Dispatcher');
var KeyframeAnimation_1 = require('./KeyframeAnimation');
var Animator_1 = require('./Animator');
// fixme!: this controls the amount of time left before the timeline gives up 
// on individual animation and calls finish.  If an animation plays after its time, it looks
// like it restarts and that causes jank
var animationPadding = 1.0 / 30;
var timelineAnimatorPrototype = {
    __: undefined,
    duration: function () {
        return this.__._duration;
    },
    iterationStart: function () {
        return this.__._iterationStart;
    },
    iterations: function () {
        return this.__._iterations;
    },
    totalDuration: function () {
        return this.__._totalDuration;
    },
    endTime: function () {
        return this.__._endTime;
    },
    startTime: function () {
        return this.__._startTime;
    },
    currentTime: function (value) {
        if (!type_1.isDefined(value)) {
            return this.__._currentTime;
        }
        this.__._currentTime = value;
        return this;
    },
    playbackRate: function (value) {
        if (!type_1.isDefined(value)) {
            return this.__._playbackRate;
        }
        this.__._playbackRate = value;
        return this;
    },
    playState: function (value) {
        if (!type_1.isDefined(value)) {
            return this.__._playState;
        }
        this.__._playState = value;
        this.__._dispatcher.trigger('set', ['playbackState', value]);
        return this;
    },
    on: function (eventName, listener) {
        this.__._dispatcher.on(eventName, listener);
        return this;
    },
    off: function (eventName, listener) {
        this.__._dispatcher.off(eventName, listener);
        return this;
    },
    finish: function () {
        this.__._isFinished = true;
        return this;
    },
    play: function () {
        this.__._playbackRate = 1;
        this.__._isPaused = false;
        if (!this.__._isInEffect) {
            if (this.__._playbackRate < 0) {
                this.__._currentTime = this.__._duration;
            }
            else {
                this.__._currentTime = 0;
            }
            window.requestAnimationFrame(_tick.bind(undefined, this.__));
        }
        return this;
    },
    pause: function () {
        if (this.__._isInEffect) {
            this.__._isPaused = true;
        }
        return this;
    },
    reverse: function () {
        this.__._playbackRate = -1;
        this.__._isPaused = false;
        if (!this.__._isInEffect) {
            if (this.__._currentTime <= 0) {
                this.__._currentTime = this.__._duration;
            }
            window.requestAnimationFrame(_tick.bind(undefined, this.__));
        }
        return this;
    },
    cancel: function () {
        this.__._playbackRate = 0;
        this.__._isCanceled = true;
        return this;
    }
};
function createTimelineAnimator(options, timeloop) {
    var self = Object.create(timelineAnimatorPrototype);
    var duration = options.duration;
    if (!type_1.isDefined(duration)) {
        throw 'Duration is required';
    }
    self.__ = {
        _currentTime: 0,
        _dispatcher: Dispatcher_1.createDispatcher(),
        _duration: options.duration,
        _endTime: undefined,
        _events: lists_1.map(options.events, function (evt) { return new TimelineEvent(timeloop, duration, evt); }),
        _isCanceled: undefined,
        _isFinished: undefined,
        _isInEffect: undefined,
        _isPaused: undefined,
        _iterationStart: 0,
        _iterations: 1,
        _lastTick: undefined,
        _playState: undefined,
        _playbackRate: 0,
        _startTime: 0,
        _timeLoop: timeloop,
        _totalDuration: options.duration
    };
    if (options.autoplay) {
        self.play();
    }
    return self;
}
exports.createTimelineAnimator = createTimelineAnimator;
function _tick(self) {
    // handle cancelation and finishing early
    if (self._isCanceled) {
        _triggerCancel(self);
        return;
    }
    if (self._isFinished) {
        _triggerFinish(self);
        return;
    }
    if (self._isPaused) {
        _triggerPause(self);
        return;
    }
    if (!self._isInEffect) {
        self._isInEffect = true;
    }
    // calculate currentTime from delta
    var thisTick = performance.now();
    var lastTick = self._lastTick;
    if (lastTick !== undefined) {
        var delta = (thisTick - lastTick) * self._playbackRate;
        self._currentTime += delta;
    }
    self._lastTick = thisTick;
    // check if animation has finished
    if (self._currentTime > self._duration || self._currentTime < 0) {
        _triggerFinish(self);
        return;
    }
    // start animations if should be active and currently aren't       
    lists_1.each(self._events, function (evt) {
        var startTimeMs = self._playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
        var endTimeMs = self._playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
        var shouldBeActive = startTimeMs <= self._currentTime && self._currentTime < endTimeMs;
        if (!shouldBeActive) {
            evt.isInEffect = false;
            return;
        }
        var animator = evt.animator();
        animator.playbackRate(self._playbackRate);
        evt.isInEffect = true;
        animator.play();
    });
    window.requestAnimationFrame(_tick.bind(undefined, self));
}
function _triggerFinish(self) {
    _reset(self);
    lists_1.each(self._events, function (evt) { return evt.animator().finish(); });
    self._dispatcher.trigger('finish');
}
function _triggerCancel(self) {
    _reset(self);
    lists_1.each(self._events, function (evt) { return evt.animator().cancel(); });
    self._dispatcher.trigger('cancel');
}
function _triggerPause(self) {
    self._isPaused = true;
    self._isInEffect = false;
    self._lastTick = undefined;
    self._playbackRate = 0;
    lists_1.each(self._events, function (evt) {
        evt.isInEffect = false;
        evt.animator().pause();
    });
}
function _reset(self) {
    self._currentTime = 0;
    self._lastTick = undefined;
    self._isCanceled = false;
    self._isFinished = false;
    self._isPaused = false;
    self._isInEffect = false;
    lists_1.each(self._events, function (evt) {
        evt.isInEffect = false;
    });
}
var TimelineEvent = (function () {
    function TimelineEvent(timeloop, timelineDuration, evt) {
        var keyframes = evt.keyframes;
        var timings = evt.timings;
        var el = evt.el;
        // calculate endtime
        var startTime = timelineDuration * evt.offset;
        var endTime = startTime + timings.duration;
        var isClipped = endTime > timelineDuration;
        // if end of animation is clipped, set endTime to duration            
        if (isClipped) {
            endTime = timelineDuration;
        }
        this.el = el;
        this.isClipped = isClipped;
        this.isInEffect = false;
        this.endTimeMs = endTime;
        this.keyframes = keyframes;
        this.offset = evt.offset;
        this.startTimeMs = startTime;
        this.timings = timings;
        this._timeLoop = timeloop;
    }
    TimelineEvent.prototype.animator = function () {
        var _this = this;
        if (!this._animator) {
            var elements = elements_1.queryElements(this.el);
            var effects = lists_1.map(elements, function (e) { return KeyframeAnimation_1.createKeyframeAnimation(e, _this.keyframes, _this.timings); });
            this._animator = Animator_1.createMultiAnimator(effects, this._timeLoop);
            this._animator.pause();
        }
        return this._animator;
    };
    return TimelineEvent;
}());

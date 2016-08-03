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
var TimelineAnimator = (function () {
    /**
     * Creates an instance of TimelineAnimator.
     *
     * @param {ja.IAnimationManager} manager (description)
     * @param {ja.ITimelineOptions} options (description)
     */
    function TimelineAnimator(options, timeloop) {
        var duration = options.duration;
        if (duration === undefined) {
            throw 'Duration is required';
        }
        this._timeLoop = timeloop;
        this._dispatcher = Dispatcher_1.createDispatcher();
        this._playbackRate = 0;
        this._duration = options.duration;
        this._currentTime = 0;
        this._events = lists_1.map(options.events, function (evt) { return new TimelineEvent(timeloop, duration, evt); });
        this._isPaused = false;
        // ensure context of tick is this instance        
        this._tick = this._tick.bind(this);
        if (options.autoplay) {
            this.play();
        }
    }
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
        if (!type_1.isDefined(value)) {
            return this._currentTime;
        }
        this._currentTime = value;
        return this;
    };
    TimelineAnimator.prototype.playbackRate = function (value) {
        if (!type_1.isDefined(value)) {
            return this._playbackRate;
        }
        this._playbackRate = value;
        return this;
    };
    TimelineAnimator.prototype.playState = function (value) {
        if (!type_1.isDefined(value)) {
            return this._playState;
        }
        this._playState = value;
        this._dispatcher.trigger('set', ['playbackState', value]);
        return this;
    };
    TimelineAnimator.prototype.on = function (eventName, listener) {
        this._dispatcher.on(eventName, listener);
        return this;
    };
    TimelineAnimator.prototype.off = function (eventName, listener) {
        this._dispatcher.off(eventName, listener);
        return this;
    };
    TimelineAnimator.prototype.finish = function () {
        this._isFinished = true;
        return this;
    };
    TimelineAnimator.prototype.play = function () {
        this._playbackRate = 1;
        this._isPaused = false;
        if (!this._isInEffect) {
            if (this._playbackRate < 0) {
                this._currentTime = this._duration;
            }
            else {
                this._currentTime = 0;
            }
            window.requestAnimationFrame(this._tick);
        }
        return this;
    };
    TimelineAnimator.prototype.pause = function () {
        if (this._isInEffect) {
            this._isPaused = true;
        }
        return this;
    };
    TimelineAnimator.prototype.reverse = function () {
        this._playbackRate = -1;
        this._isPaused = false;
        if (!this._isInEffect) {
            if (this._currentTime <= 0) {
                this._currentTime = this._duration;
            }
            window.requestAnimationFrame(this._tick);
        }
        return this;
    };
    TimelineAnimator.prototype.cancel = function () {
        this._playbackRate = 0;
        this._isCanceled = true;
        return this;
    };
    TimelineAnimator.prototype._tick = function () {
        var _this = this;
        // handle cancelation and finishing early
        if (this._isCanceled) {
            this._triggerCancel();
            return;
        }
        if (this._isFinished) {
            this._triggerFinish();
            return;
        }
        if (this._isPaused) {
            this._triggerPause();
            return;
        }
        if (!this._isInEffect) {
            this._isInEffect = true;
        }
        // calculate currentTime from delta
        var thisTick = performance.now();
        var lastTick = this._lastTick;
        if (lastTick !== undefined) {
            var delta = (thisTick - lastTick) * this._playbackRate;
            this._currentTime += delta;
        }
        this._lastTick = thisTick;
        // check if animation has finished
        if (this._currentTime > this._duration || this._currentTime < 0) {
            this._triggerFinish();
            return;
        }
        // start animations if should be active and currently aren't       
        lists_1.each(this._events, function (evt) {
            var startTimeMs = _this._playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
            var endTimeMs = _this._playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
            var shouldBeActive = startTimeMs <= _this._currentTime && _this._currentTime < endTimeMs;
            if (!shouldBeActive) {
                evt.isInEffect = false;
                return;
            }
            var animator = evt.animator();
            animator.playbackRate(_this._playbackRate);
            evt.isInEffect = true;
            animator.play();
        });
        window.requestAnimationFrame(this._tick);
    };
    TimelineAnimator.prototype._triggerFinish = function () {
        this._reset();
        lists_1.each(this._events, function (evt) { return evt.animator().finish(); });
        this._dispatcher.trigger('finish');
    };
    TimelineAnimator.prototype._triggerCancel = function () {
        this._reset();
        lists_1.each(this._events, function (evt) { return evt.animator().cancel(); });
        this._dispatcher.trigger('cancel');
    };
    TimelineAnimator.prototype._triggerPause = function () {
        this._isPaused = true;
        this._isInEffect = false;
        this._lastTick = undefined;
        this._playbackRate = 0;
        lists_1.each(this._events, function (evt) {
            evt.isInEffect = false;
            evt.animator().pause();
        });
    };
    TimelineAnimator.prototype._reset = function () {
        this._currentTime = 0;
        this._lastTick = undefined;
        this._isCanceled = false;
        this._isFinished = false;
        this._isPaused = false;
        this._isInEffect = false;
        lists_1.each(this._events, function (evt) {
            evt.isInEffect = false;
        });
    };
    return TimelineAnimator;
}());
exports.TimelineAnimator = TimelineAnimator;
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

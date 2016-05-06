"use strict";
var helpers_1 = require('./helpers');
var animationPadding = 1.0 / 30;
var TimelineAnimator = (function () {
    function TimelineAnimator(manager, options) {
        var duration = options.duration;
        if (duration === undefined) {
            throw Error('Duration is required');
        }
        this.playbackRate = 0;
        this.duration = options.duration;
        this.currentTime = 0;
        this._events = helpers_1.map(options.events, function (evt) { return new TimelineEvent(manager, duration, evt); });
        this._isPaused = false;
        this._manager = manager;
        this._tick = this._tick.bind(this);
        if (options.autoplay) {
            this.play();
        }
    }
    TimelineAnimator.prototype.finish = function (fn) {
        this._isFinished = true;
        return this;
    };
    TimelineAnimator.prototype.play = function (fn) {
        this.playbackRate = 1;
        this._isPaused = false;
        if (this._isInEffect) {
            return this;
        }
        if (this.playbackRate < 0) {
            this.currentTime = this.duration;
        }
        else {
            this.currentTime = 0;
        }
        window.requestAnimationFrame(this._tick);
        return this;
    };
    TimelineAnimator.prototype.pause = function (fn) {
        if (this._isInEffect) {
            this._isPaused = true;
        }
        return this;
    };
    TimelineAnimator.prototype.reverse = function (fn) {
        this.playbackRate = -1;
        this._isPaused = false;
        if (this._isInEffect) {
            return this;
        }
        if (this.currentTime <= 0) {
            this.currentTime = this.duration;
        }
        window.requestAnimationFrame(this._tick);
        return this;
    };
    TimelineAnimator.prototype.cancel = function (fn) {
        this.playbackRate = 0;
        this._isCanceled = true;
        return this;
    };
    TimelineAnimator.prototype._tick = function () {
        var _this = this;
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
        var thisTick = performance.now();
        var lastTick = this._lastTick;
        if (lastTick !== undefined) {
            var delta = (thisTick - lastTick) * this.playbackRate;
            this.currentTime += delta;
        }
        this._lastTick = thisTick;
        if (this.currentTime > this.duration || this.currentTime < 0) {
            this._triggerFinish();
            return;
        }
        helpers_1.each(this._events, function (evt) {
            var startTimeMs = _this.playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
            var endTimeMs = _this.playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
            var shouldBeActive = startTimeMs <= _this.currentTime && _this.currentTime < endTimeMs;
            if (!shouldBeActive) {
                evt.isInEffect = false;
                return;
            }
            evt.animator.playbackRate = _this.playbackRate;
            evt.isInEffect = true;
            evt.animator.play();
        });
        window.requestAnimationFrame(this._tick);
    };
    TimelineAnimator.prototype._triggerFinish = function () {
        this._reset();
        helpers_1.each(this._events, function (evt) { return evt.animator.finish(); });
        if (helpers_1.isFunction(this.onfinish)) {
            this.onfinish(this);
        }
    };
    TimelineAnimator.prototype._triggerCancel = function () {
        this._reset();
        helpers_1.each(this._events, function (evt) { return evt.animator.cancel(); });
        if (helpers_1.isFunction(this.oncancel)) {
            this.oncancel(this);
        }
    };
    TimelineAnimator.prototype._triggerPause = function () {
        this._isPaused = true;
        this._isInEffect = false;
        this._lastTick = undefined;
        this.playbackRate = 0;
        helpers_1.each(this._events, function (evt) {
            evt.isInEffect = false;
            evt.animator.pause();
        });
    };
    TimelineAnimator.prototype._reset = function () {
        this.currentTime = 0;
        this._lastTick = undefined;
        this._isCanceled = false;
        this._isFinished = false;
        this._isPaused = false;
        this._isInEffect = false;
        helpers_1.each(this._events, function (evt) {
            evt.isInEffect = false;
        });
    };
    return TimelineAnimator;
}());
exports.TimelineAnimator = TimelineAnimator;
var TimelineEvent = (function () {
    function TimelineEvent(manager, timelineDuration, evt) {
        var keyframes;
        var timings;
        var el;
        if (evt.name) {
            var definition = manager.findAnimation(evt.name);
            var timings2 = helpers_1.extend({}, definition.timings);
            if (evt.timings) {
                timings = helpers_1.extend(timings2, evt.timings);
            }
            keyframes = definition.keyframes;
            timings = timings2;
            el = evt.el;
        }
        else {
            keyframes = evt.keyframes;
            timings = evt.timings;
            el = evt.el;
        }
        var startTime = timelineDuration * evt.offset;
        var endTime = startTime + timings.duration;
        var isClipped = endTime > timelineDuration;
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
        this._manager = manager;
    }
    Object.defineProperty(TimelineEvent.prototype, "animator", {
        get: function () {
            if (this._animator === undefined) {
                this._animator = this._manager.animate(this.keyframes, this.el, this.timings);
                this._animator.pause();
            }
            return this._animator;
        },
        enumerable: true,
        configurable: true
    });
    return TimelineEvent;
}());

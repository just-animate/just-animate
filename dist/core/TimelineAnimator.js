"use strict";
var objects_1 = require('../helpers/objects');
var lists_1 = require('../helpers/lists');
var Dispatcher_1 = require('./Dispatcher');
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
    function TimelineAnimator(manager, options) {
        this._dispatcher = new Dispatcher_1.Dispatcher();
        var duration = options.duration;
        if (duration === undefined) {
            throw 'Duration is required';
        }
        this.playbackRate = 0;
        this.duration = options.duration;
        this.currentTime = 0;
        this._events = lists_1.map(options.events, function (evt) { return new TimelineEvent(manager, duration, evt); });
        this._isPaused = false;
        this._manager = manager;
        // ensure context of tick is this instance        
        this._tick = this._tick.bind(this);
        if (options.autoplay) {
            this.play();
        }
    }
    TimelineAnimator.prototype.addEventListener = function (eventName, listener) {
        this._dispatcher.on(eventName, listener);
    };
    TimelineAnimator.prototype.removeEventListener = function (eventName, listener) {
        this._dispatcher.off(eventName, listener);
    };
    TimelineAnimator.prototype.finish = function () {
        this._isFinished = true;
    };
    TimelineAnimator.prototype.play = function () {
        this.playbackRate = 1;
        this._isPaused = false;
        if (this._isInEffect) {
            return;
        }
        if (this.playbackRate < 0) {
            this.currentTime = this.duration;
        }
        else {
            this.currentTime = 0;
        }
        window.requestAnimationFrame(this._tick);
    };
    TimelineAnimator.prototype.pause = function () {
        if (this._isInEffect) {
            this._isPaused = true;
        }
    };
    TimelineAnimator.prototype.reverse = function () {
        this.playbackRate = -1;
        this._isPaused = false;
        if (this._isInEffect) {
            return;
        }
        if (this.currentTime <= 0) {
            this.currentTime = this.duration;
        }
        window.requestAnimationFrame(this._tick);
    };
    TimelineAnimator.prototype.cancel = function () {
        this.playbackRate = 0;
        this._isCanceled = true;
        return;
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
            var delta = (thisTick - lastTick) * this.playbackRate;
            this.currentTime += delta;
        }
        this._lastTick = thisTick;
        // check if animation has finished
        if (this.currentTime > this.duration || this.currentTime < 0) {
            this._triggerFinish();
            return;
        }
        // start animations if should be active and currently aren't        
        lists_1.each(this._events, function (evt) {
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
        lists_1.each(this._events, function (evt) { return evt.animator.finish(); });
        this._dispatcher.trigger('finish');
    };
    TimelineAnimator.prototype._triggerCancel = function () {
        this._reset();
        lists_1.each(this._events, function (evt) { return evt.animator.cancel(); });
        this._dispatcher.trigger('cancel');
    };
    TimelineAnimator.prototype._triggerPause = function () {
        this._isPaused = true;
        this._isInEffect = false;
        this._lastTick = undefined;
        this.playbackRate = 0;
        lists_1.each(this._events, function (evt) {
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
        lists_1.each(this._events, function (evt) {
            evt.isInEffect = false;
        });
    };
    Object.defineProperty(TimelineAnimator.prototype, "iterationStart", {
        get: function () {
            return this._iterationStart;
        },
        set: function (value) {
            this._iterationStart = value;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(TimelineAnimator.prototype, "iterations", {
        get: function () {
            return this._iterations;
        },
        set: function (value) {
            this._iterations = value;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(TimelineAnimator.prototype, "totalDuration", {
        get: function () {
            return this._totalDuration;
        },
        set: function (value) {
            this._totalDuration = value;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(TimelineAnimator.prototype, "endTime", {
        get: function () {
            return this._endTime;
        },
        set: function (value) {
            this._endTime = value;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(TimelineAnimator.prototype, "startTime", {
        get: function () {
            return this._startTime;
        },
        set: function (value) {
            this._startTime = value;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(TimelineAnimator.prototype, "playState", {
        get: function () {
            return this._playState;
        },
        set: function (value) {
            this._playState = value;
            this._dispatcher.trigger('set', ['playbackState', value]);
        },
        enumerable: true,
        configurable: true
    });
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
            var timings2 = objects_1.extend({}, definition.timings);
            if (evt.timings) {
                timings = objects_1.extend(timings2, evt.timings);
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

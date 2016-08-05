"use strict";
var lists_1 = require('../helpers/lists');
var type_1 = require('../helpers/type');
var elements_1 = require('../helpers/elements');
var Dispatcher_1 = require('./Dispatcher');
var KeyframeAnimation_1 = require('./KeyframeAnimation');
var Animator_1 = require('./Animator');
var errors_1 = require('../helpers/errors');
var resources_1 = require('../helpers/resources');
// fixme!: this controls the amount of time left before the timeline gives up 
// on individual animation and calls finish.  If an animation plays after its time, it looks
// like it restarts and that causes jank
var animationPadding = 1.0 / 30;
var timelineAnimatorPrototype = {
    _: undefined,
    duration: function () {
        return this._.duration;
    },
    iterationStart: function () {
        return this._.iterationStart;
    },
    iterations: function () {
        return this._.iterations;
    },
    totalDuration: function () {
        return this._.totalDuration;
    },
    endTime: function () {
        return this._.endTime;
    },
    startTime: function () {
        return this._.startTime;
    },
    currentTime: function (value) {
        if (!type_1.isDefined(value)) {
            return this._.currentTime;
        }
        this._.currentTime = value;
        return this;
    },
    playbackRate: function (value) {
        if (!type_1.isDefined(value)) {
            return this._.playbackRate;
        }
        this._.playbackRate = value;
        return this;
    },
    playState: function (value) {
        if (!type_1.isDefined(value)) {
            return this._.playState;
        }
        this._.playState = value;
        this._.dispatcher.trigger('set', ['playbackState', value]);
        return this;
    },
    on: function (eventName, listener) {
        this._.dispatcher.on(eventName, listener);
        return this;
    },
    off: function (eventName, listener) {
        this._.dispatcher.off(eventName, listener);
        return this;
    },
    finish: function () {
        this._.isFinished = true;
        return this;
    },
    play: function () {
        this._.playbackRate = 1;
        this._.isPaused = false;
        if (!this._.isInEffect) {
            if (this._.playbackRate < 0) {
                this._.currentTime = this._.duration;
            }
            else {
                this._.currentTime = 0;
            }
            window.requestAnimationFrame(tick.bind(undefined, this._));
        }
        return this;
    },
    pause: function () {
        if (this._.isInEffect) {
            this._.isPaused = true;
        }
        return this;
    },
    reverse: function () {
        this._.playbackRate = -1;
        this._.isPaused = false;
        if (!this._.isInEffect) {
            if (this._.currentTime <= 0) {
                this._.currentTime = this._.duration;
            }
            window.requestAnimationFrame(tick.bind(undefined, this._));
        }
        return this;
    },
    cancel: function () {
        this._.playbackRate = 0;
        this._.isCanceled = true;
        return this;
    }
};
function createTimelineAnimator(options, timeloop) {
    var self = Object.create(timelineAnimatorPrototype);
    var duration1 = options.duration;
    if (!type_1.isDefined(resources_1.duration)) {
        throw errors_1.invalidArg(resources_1.duration);
    }
    self._ = {
        currentTime: 0,
        dispatcher: Dispatcher_1.createDispatcher(),
        duration: options.duration,
        endTime: undefined,
        events: lists_1.map(options.events, function (evt) { return createEvent(timeloop, duration1, evt); }),
        isCanceled: undefined,
        isFinished: undefined,
        isInEffect: undefined,
        isPaused: undefined,
        iterationStart: 0,
        iterations: 1,
        lastTick: undefined,
        playState: undefined,
        playbackRate: 0,
        startTime: 0,
        timeLoop: timeloop,
        totalDuration: options.duration
    };
    if (options.autoplay) {
        self.play();
    }
    return self;
}
exports.createTimelineAnimator = createTimelineAnimator;
function tick(self) {
    // handle cancelation and finishing early
    if (self.isCanceled) {
        triggerCancel(self);
        return;
    }
    if (self.isFinished) {
        triggerFinish(self);
        return;
    }
    if (self.isPaused) {
        triggerPause(self);
        return;
    }
    if (!self.isInEffect) {
        self.isInEffect = true;
    }
    // calculate currentTime from delta
    var thisTick = performance.now();
    var lastTick = self.lastTick;
    if (lastTick !== undefined) {
        var delta = (thisTick - lastTick) * self.playbackRate;
        self.currentTime += delta;
    }
    self.lastTick = thisTick;
    // check if animation has finished
    if (self.currentTime > self.duration || self.currentTime < 0) {
        triggerFinish(self);
        return;
    }
    // start animations if should be active and currently aren't   
    var playbackRate = self.playbackRate;
    lists_1.each(self.events, function (evt) {
        var startTimeMs = playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
        var endTimeMs = self.playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
        var shouldBeActive = startTimeMs <= self.currentTime && self.currentTime < endTimeMs;
        if (!shouldBeActive) {
            return;
        }
        var animator = evt.animator();
        animator.playbackRate(self.playbackRate);
        animator.play();
    });
    window.requestAnimationFrame(tick.bind(undefined, self));
}
function triggerFinish(self) {
    reset(self);
    lists_1.each(self.events, function (evt) { return evt.animator().finish(); });
    self.dispatcher.trigger(resources_1.finish);
}
function triggerCancel(self) {
    reset(self);
    lists_1.each(self.events, function (evt) { return evt.animator().cancel(); });
    self.dispatcher.trigger(resources_1.cancel);
}
function triggerPause(self) {
    self.isPaused = true;
    self.isInEffect = false;
    self.lastTick = undefined;
    self.playbackRate = 0;
    lists_1.each(self.events, function (evt) {
        evt.animator().pause();
    });
}
function reset(self) {
    self.currentTime = 0;
    self.lastTick = undefined;
    self.isCanceled = false;
    self.isFinished = false;
    self.isPaused = false;
    self.isInEffect = false;
}
function createEvent(timeloop, timelineDuration, evt) {
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
    return {
        _animator: undefined,
        _timeLoop: timeloop,
        animator: animator,
        el: el,
        endTimeMs: endTime,
        isClipped: isClipped,
        keyframes: keyframes,
        offset: evt.offset,
        startTimeMs: startTime,
        timings: timings
    };
}
function animator() {
    var _this = this;
    if (!this._animator) {
        var elements = elements_1.queryElements(this.el);
        var effects = lists_1.map(elements, function (e) { return KeyframeAnimation_1.createKeyframeAnimation(e, _this.keyframes, _this.timings); });
        this._animator = Animator_1.createMultiAnimator(effects, this._timeLoop);
        this._animator.pause();
    }
    return this._animator;
}

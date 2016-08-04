"use strict";
var lists_1 = require('./helpers/lists');
var TimelineAnimator_1 = require('./core/TimelineAnimator');
var TimeLoop_1 = require('./core/TimeLoop');
var Animator_1 = require('./core/Animator');
var easings_1 = require('./easings');
var functions_1 = require('./helpers/functions');
var objects_1 = require('./helpers/objects');
var type_1 = require('./helpers/type');
var keyframes_1 = require('./helpers/keyframes');
var elements_1 = require('./helpers/elements');
var KeyframeAnimation_1 = require('./core/KeyframeAnimation');
var globalAnimations = {};
function JustAnimate() {
    var self = this;
    self = self instanceof JustAnimate ? self : Object.create(JustAnimate.prototype);
    self._registry = {};
    self._timeLoop = TimeLoop_1.createLoop();
    return self;
}
exports.JustAnimate = JustAnimate;
JustAnimate.inject = inject;
JustAnimate.prototype = {
    _registry: undefined,
    _timeLoop: undefined,
    animate: function (keyframesOrName, targets, timings) {
        var a = resolveArguments(this, keyframesOrName, timings);
        var elements = elements_1.queryElements(targets);
        var effects = lists_1.map(elements, function (e) { return KeyframeAnimation_1.createKeyframeAnimation(e, a.keyframes, a.timings); });
        var animator = Animator_1.createMultiAnimator(effects, this._timeLoop);
        animator.play();
        return animator;
    },
    animateSequence: function (options) {
        var _this = this;
        var offset = 0;
        var effectOptions = lists_1.map(options.steps, function (step) {
            var a = resolveArguments(_this, step.name || step.keyframes, step.timings);
            var startDelay = a.timings.delay || 0;
            var endDelay = a.timings.endDelay || 0;
            var duration = a.timings.duration || 0;
            a.timings.delay = offset + startDelay;
            a.targets = step.el;
            offset += startDelay + duration + endDelay;
            return a;
        });
        lists_1.each(effectOptions, function (e) {
            e.timings.endDelay = offset - ((e.timings.delay || 0) + e.timings.duration + (e.timings.endDelay || 0));
        });
        var effects = [];
        lists_1.each(effectOptions, function (a) {
            var elements = elements_1.queryElements(a.targets);
            var animations = lists_1.map(elements, function (e) { return KeyframeAnimation_1.createKeyframeAnimation(e, a.keyframes, a.timings); });
            if (animations.length === 1) {
                effects.push(animations[0]);
            }
            else if (animations.length > 1) {
                effects.push(Animator_1.createMultiAnimator(animations, _this._timeLoop));
            }
        });
        var animator = Animator_1.createMultiAnimator(effects, this._timeLoop);
        if (options.autoplay) {
            animator.play();
        }
        return animator;
    },
    animateTimeline: function (options) {
        var _this = this;
        options.events.forEach(function (e) {
            var a = resolveArguments(_this, e.name || e.keyframes, e.timings);
            e.keyframes = a.keyframes;
            e.timings = a.timings;
        });
        return TimelineAnimator_1.createTimelineAnimator(options, this._timeLoop);
    },
    findAnimation: function (name) {
        return this._registry[name] || globalAnimations[name] || undefined;
    },
    register: function (animationOptions) {
        this._registry[animationOptions.name] = animationOptions;
    },
    inject: inject
};
function inject(animations) {
    lists_1.each(animations, function (a) { return globalAnimations[a.name] = a; });
}
function resolveArguments(ctx, keyframesOrName, timings) {
    var keyframes;
    if (type_1.isString(keyframesOrName)) {
        // if keyframes is a string, lookup keyframes from registry
        var definition = ctx.findAnimation(keyframesOrName);
        keyframes = functions_1.pipe(lists_1.map(definition.keyframes, keyframes_1.normalizeProperties), keyframes_1.spaceKeyframes, keyframes_1.normalizeKeyframes);
        // use registered timings as default, then load timings from params           
        timings = objects_1.extend({}, definition.timings, timings);
    }
    else {
        // otherwise, translate keyframe properties
        keyframes = functions_1.pipe(lists_1.map(keyframesOrName, keyframes_1.normalizeProperties), keyframes_1.spaceKeyframes, keyframes_1.normalizeKeyframes);
    }
    if (timings && timings.easing) {
        // if timings contains an easing property, 
        var easing = easings_1.easings[timings.easing];
        if (easing) {
            timings.easing = easing;
        }
    }
    return {
        keyframes: keyframes,
        timings: timings
    };
}

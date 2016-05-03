(function () {
    'use strict';

    const ostring = Object.prototype.toString;
    const slice = Array.prototype.slice;
    function noop() {
    }
    function head(indexed) {
        return (!indexed || indexed.length < 1) ? undefined : indexed[0];
    }
    function isArray(a) {
        return !isString(a) && isNumber(a.length);
    }
    function isFunction(a) {
        return ostring.call(a) === '[object Function]';
    }
    function isNumber(a) {
        return typeof a === 'number';
    }
    function isString(a) {
        return typeof a === 'string';
    }
    function toArray(indexed) {
        return slice.call(indexed, 0);
    }
    function each(items, fn) {
        for (let i = 0, len = items.length; i < len; i++) {
            fn(items[i]);
        }
    }
    function max(items, propertyName) {
        let max = '';
        for (let i = 0, len = items.length; i < len; i++) {
            const prop = items[i][propertyName];
            if (max < prop) {
                max = prop;
            }
        }
        return max;
    }
    function map(items, fn) {
        const results = [];
        for (let i = 0, len = items.length; i < len; i++) {
            const result = fn(items[i]);
            if (result !== undefined) {
                results.push(result);
            }
        }
        return results;
    }
    function extend(target, ...sources) {
        for (let i = 1, len = arguments.length; i < len; i++) {
            const source = arguments[i];
            for (let propName in source) {
                target[propName] = source[propName];
            }
        }
        return target;
    }
    function multiapply(targets, fnName, args, cb) {
        const errors = [];
        const results = [];
        for (let i = 0, len = targets.length; i < len; i++) {
            try {
                const target = targets[i];
                let result;
                if (fnName) {
                    result = target[fnName].apply(target, args);
                }
                else {
                    result = target.apply(undefined, args);
                }
                if (result !== undefined) {
                    results.push(result);
                }
            }
            catch (err) {
                errors.push(err);
            }
        }
        if (isFunction(cb)) {
            cb(errors);
        }
        return results;
    }

    const easings = {
        'easeInCubic': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
        'easeOutCubic': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
        'easeInOutCubic': 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
        'easeInCirc': 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
        'easeOutCirc': 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
        'easeInOutCirc': 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
        'easeInExpo': 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
        'easeOutExpo': 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
        'easeInOutExpo': 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
        'easeInQuad': 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
        'easeOutQuad': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        'easeInOutQuad': 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
        'easeInQuart': 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
        'easeOutQuart': 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
        'easeInOutQuart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
        'easeInQuint': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
        'easeOutQuint': 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
        'easeInOutQuint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
        'easeInSine': 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
        'easeOutSine': 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
        'easeInOutSine': 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
        'easeInBack': 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
        'easeOutBack': 'cubic-bezier(0.175,  0.885, 0.320, 1.275)',
        'easeInOutBack': 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
        'elegantSlowStartEnd': 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'
    };

    class ElementAnimator {
        constructor(manager, keyframesOrName, el, timings) {
            if (!keyframesOrName) {
                return;
            }
            let keyframes;
            if (isString(keyframesOrName)) {
                const definition = manager.findAnimation(keyframesOrName);
                keyframes = definition.keyframes;
                timings = extend({}, definition.timings, timings);
            }
            else {
                keyframes = keyframesOrName;
            }
            if (timings && timings.easing) {
                const easing = easings[timings.easing];
                if (easing) {
                    timings.easing = easing;
                }
            }
            this.duration = timings.duration;
            const elements = getElements(el);
            this._animators = multiapply(elements, 'animate', [keyframes, timings]);
            if (this._animators.length > 0) {
                this._animators[0].onfinish = () => {
                    this.finish();
                };
            }
        }
        get playbackRate() {
            const first = head(this._animators);
            return first ? first.playbackRate : 0;
        }
        set playbackRate(val) {
            each(this._animators, (a) => a.playbackRate = val);
        }
        get currentTime() {
            return max(this._animators, 'currentTime') || 0;
        }
        set currentTime(elapsed) {
            each(this._animators, (a) => a.currentTime = elapsed);
        }
        finish(fn) {
            multiapply(this._animators, 'finish', [], fn);
            if (this.playbackRate < 0) {
                each(this._animators, (a) => a.currentTime = 0);
            }
            else {
                each(this._animators, (a) => a.currentTime = this.duration);
            }
            if (isFunction(this.onfinish)) {
                this.onfinish(this);
            }
            return this;
        }
        play(fn) {
            multiapply(this._animators, 'play', [], fn);
            return this;
        }
        pause(fn) {
            multiapply(this._animators, 'pause', [], fn);
            return this;
        }
        reverse(fn) {
            multiapply(this._animators, 'reverse', [], fn);
            return this;
        }
        cancel(fn) {
            multiapply(this._animators, 'cancel', [], fn);
            each(this._animators, (a) => a.currentTime = 0);
            if (isFunction(this.oncancel)) {
                this.oncancel(this);
            }
            return this;
        }
    }
    function getElements(source) {
        if (!source) {
            throw Error('source is undefined');
        }
        if (isString(source)) {
            const nodeResults = document.querySelectorAll(source);
            return toArray(nodeResults);
        }
        if (source instanceof Element) {
            return [source];
        }
        if (isFunction(source)) {
            const provider = source;
            const result = provider();
            return getElements(result);
        }
        if (isArray(source)) {
            const elements = [];
            each(source, (i) => {
                const innerElements = getElements(i);
                elements.push.apply(elements, innerElements);
            });
            return elements;
        }
        return [];
    }

    class SequenceAnimator {
        constructor(manager, options) {
            const steps = map(options.steps, (step) => {
                if (step.command || !step.name) {
                    return step;
                }
                const definition = manager.findAnimation(step.name);
                let timings = extend({}, definition.timings);
                if (step.timings) {
                    timings = extend(timings, step.timings);
                }
                return {
                    el: step.el,
                    keyframes: definition.keyframes,
                    timings: timings
                };
            });
            this.onfinish = noop;
            this._currentIndex = -1;
            this._manager = manager;
            this._steps = steps;
            if (options.autoplay === true) {
                this.play();
            }
        }
        get currentTime() {
            const currentIndex = this._currentIndex;
            const len = this._steps.length;
            if (currentIndex === -1 || currentIndex === len) {
                return 0;
            }
            const isReversed = this.playbackRate === -1;
            let beforeTime = 0;
            let afterTime = 0;
            let currentTime;
            for (let i = 0; i < len; i++) {
                const step = this._steps[i];
                if (i < currentIndex) {
                    beforeTime += step.timings.duration;
                    continue;
                }
                if (i > currentIndex) {
                    afterTime += step.timings.duration;
                    continue;
                }
                if (isReversed) {
                    currentTime = this.duration - step.animator.currentTime;
                    continue;
                }
                currentTime = step.animator.currentTime;
            }
            return currentTime + (isReversed ? afterTime : beforeTime);
        }
        get duration() {
            return this._steps.reduce((c, n) => c + (n.timings.duration || 0), 0);
        }
        finish(fn) {
            this._errorCallback = fn;
            this._currentIndex = -1;
            for (let x = 0; x < this._steps.length; x++) {
                const step = this._steps[x];
                if (step.animator !== undefined) {
                    step.animator.cancel(fn);
                }
            }
            if (isFunction(this.onfinish)) {
                this.onfinish(this);
            }
            return this;
        }
        play(fn) {
            this._errorCallback = fn;
            this.playbackRate = 1;
            this._playThisStep();
            return this;
        }
        pause(fn) {
            this._errorCallback = fn;
            if (!this._isInEffect()) {
                return this;
            }
            const animator = this._getAnimator();
            animator.pause(fn);
            return this;
        }
        reverse(fn) {
            this._errorCallback = fn;
            this.playbackRate = -1;
            this._playThisStep();
            return this;
        }
        cancel(fn) {
            this._errorCallback = fn;
            this.playbackRate = undefined;
            this._currentIndex = -1;
            for (let x = 0; x < this._steps.length; x++) {
                const step = this._steps[x];
                if (step.animator !== undefined) {
                    step.animator.cancel(fn);
                }
            }
            if (isFunction(this.oncancel)) {
                this.oncancel(this);
            }
            return this;
        }
        _isInEffect() {
            return this._currentIndex > -1 && this._currentIndex < this._steps.length;
        }
        _getAnimator() {
            const it = this._steps[this._currentIndex];
            if (it.animator) {
                return it.animator;
            }
            it.animator = this._manager.animate(it.keyframes, it.el, it.timings);
            return it.animator;
        }
        _playNextStep(evt) {
            if (this.playbackRate === -1) {
                this._currentIndex--;
            }
            else {
                this._currentIndex++;
            }
            if (this._isInEffect()) {
                this._playThisStep();
            }
            else {
                this.onfinish(evt);
            }
        }
        _playThisStep() {
            if (!this._isInEffect()) {
                if (this.playbackRate === -1) {
                    this._currentIndex = this._steps.length - 1;
                }
                else {
                    this._currentIndex = 0;
                }
            }
            const animator = this._getAnimator();
            animator.onfinish = (evt) => {
                this._playNextStep(evt);
            };
            animator.play(this._errorCallback);
        }
    }

    const animationPadding = 1.0 / 30;
    class TimelineAnimator {
        constructor(manager, options) {
            const duration = options.duration;
            if (duration === undefined) {
                throw Error('Duration is required');
            }
            this.playbackRate = 0;
            this.duration = options.duration;
            this.currentTime = 0;
            this._events = map(options.events, (evt) => new TimelineEvent(manager, duration, evt));
            this._isPaused = false;
            this._manager = manager;
            this._tick = this._tick.bind(this);
            if (options.autoplay) {
                this.play();
            }
        }
        finish(fn) {
            this._isFinished = true;
            return this;
        }
        play(fn) {
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
        }
        pause(fn) {
            if (this._isInEffect) {
                this._isPaused = true;
            }
            return this;
        }
        reverse(fn) {
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
        }
        cancel(fn) {
            this.playbackRate = 0;
            this._isCanceled = true;
            return this;
        }
        _tick() {
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
            const thisTick = performance.now();
            const lastTick = this._lastTick;
            if (lastTick !== undefined) {
                const delta = (thisTick - lastTick) * this.playbackRate;
                this.currentTime += delta;
            }
            this._lastTick = thisTick;
            if (this.currentTime > this.duration || this.currentTime < 0) {
                this._triggerFinish();
                return;
            }
            each(this._events, (evt) => {
                const startTimeMs = this.playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
                const endTimeMs = this.playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
                const shouldBeActive = startTimeMs <= this.currentTime && this.currentTime < endTimeMs;
                if (!shouldBeActive) {
                    evt.isInEffect = false;
                    return;
                }
                evt.animator.playbackRate = this.playbackRate;
                evt.isInEffect = true;
                evt.animator.play();
            });
            window.requestAnimationFrame(this._tick);
        }
        _triggerFinish() {
            this._reset();
            each(this._events, (evt) => evt.animator.finish());
            if (isFunction(this.onfinish)) {
                this.onfinish(this);
            }
        }
        _triggerCancel() {
            this._reset();
            each(this._events, (evt) => evt.animator.cancel());
            if (isFunction(this.oncancel)) {
                this.oncancel(this);
            }
        }
        _triggerPause() {
            this._isPaused = true;
            this._isInEffect = false;
            this._lastTick = undefined;
            this.playbackRate = 0;
            each(this._events, evt => {
                evt.isInEffect = false;
                evt.animator.pause();
            });
        }
        _reset() {
            this.currentTime = 0;
            this._lastTick = undefined;
            this._isCanceled = false;
            this._isFinished = false;
            this._isPaused = false;
            this._isInEffect = false;
            each(this._events, evt => {
                evt.isInEffect = false;
            });
        }
    }
    class TimelineEvent {
        constructor(manager, timelineDuration, evt) {
            let keyframes;
            let timings;
            let el;
            if (evt.name) {
                const definition = manager.findAnimation(evt.name);
                let timings2 = extend({}, definition.timings);
                if (evt.timings) {
                    timings = extend(timings2, evt.timings);
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
            const startTime = timelineDuration * evt.offset;
            let endTime = startTime + timings.duration;
            const isClipped = endTime > timelineDuration;
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
        get animator() {
            if (this._animator === undefined) {
                this._animator = this._manager.animate(this.keyframes, this.el, this.timings);
                this._animator.pause();
            }
            return this._animator;
        }
    }

    class AnimationManager {
        constructor() {
            this._registry = {};
            this._timings = {
                duration: 1000,
                fill: 'both'
            };
        }
        animate(keyframesOrName, el, timings) {
            return new ElementAnimator(this, keyframesOrName, el, timings);
        }
        animateSequence(options) {
            return new SequenceAnimator(this, options);
        }
        animateTimeline(options) {
            return new TimelineAnimator(this, options);
        }
        configure(timings) {
            if (timings) {
                extend(this._timings, timings);
            }
            return this;
        }
        findAnimation(name) {
            return this._registry[name] || undefined;
        }
        register(animationOptions) {
            const self = this;
            const registerAnimation = (it) => {
                self[name] = (el, timings) => self.animate(name, el, timings);
                self._registry[name] = it;
            };
            if (isArray(animationOptions)) {
                each(animationOptions, registerAnimation);
            }
            else {
                self[name] = (el, timings) => self.animate(name, el, timings);
                self._registry[name] = animationOptions;
            }
            return self;
        }
    }

    var bounce = require('./animations/bounce.json');
    var bounceIn = require('./animations/bounceIn.json');
    var bounceInDown = require('./animations/bounceInDown.json');
    var bounceInLeft = require('./animations/bounceInLeft.json');
    var bounceInRight = require('./animations/bounceInRight.json');
    var bounceInUp = require('./animations/bounceInUp.json');
    var bounceOut = require('./animations/bounceOut.json');
    var bounceOutDown = require('./animations/bounceOutDown.json');
    var bounceOutLeft = require('./animations/bounceOutLeft.json');
    var bounceOutRight = require('./animations/bounceOutRight.json');
    var bounceOutUp = require('./animations/bounceOutUp.json');
    var fadeIn = require('./animations/fadeIn.json');
    var fadeInDown = require('./animations/fadeInDown.json');
    var fadeInDownBig = require('./animations/fadeInDownBig.json');
    var fadeInLeft = require('./animations/fadeInLeft.json');
    var fadeInLeftBig = require('./animations/fadeInLeftBig.json');
    var fadeInRight = require('./animations/fadeInRight.json');
    var fadeInRightBig = require('./animations/fadeInRightBig.json');
    var fadeInUp = require('./animations/fadeInUp.json');
    var fadeInUpBig = require('./animations/fadeInUpBig.json');
    var fadeOut = require('./animations/fadeOut.json');
    var fadeOutDown = require('./animations/fadeOutDown.json');
    var fadeOutDownBig = require('./animations/fadeOutDownBig.json');
    var fadeOutLeft = require('./animations/fadeOutLeft.json');
    var fadeOutLeftBig = require('./animations/fadeOutLeftBig.json');
    var fadeOutRight = require('./animations/fadeOutRight.json');
    var fadeOutRightBig = require('./animations/fadeOutRightBig.json');
    var fadeOutUp = require('./animations/fadeOutUp.json');
    var fadeOutUpBig = require('./animations/fadeOutUpBig.json');
    var flash = require('./animations/flash.json');
    var flip = require('./animations/flip.json');
    var flipInX = require('./animations/flipInX.json');
    var flipInY = require('./animations/flipInY.json');
    var flipOutX = require('./animations/flipOutX.json');
    var flipOutY = require('./animations/flipOutY.json');
    var headShake = require('./animations/headShake.json');
    var hinge = require('./animations/hinge.json');
    var jello = require('./animations/jello.json');
    var lightSpeedIn = require('./animations/lightSpeedIn.json');
    var lightSpeedOut = require('./animations/lightSpeedOut.json');
    var pulse = require('./animations/pulse.json');
    var rollIn = require('./animations/rollIn.json');
    var rollOut = require('./animations/rollOut.json');
    var rotateIn = require('./animations/rotateIn.json');
    var rotateInDownLeft = require('./animations/rotateInDownLeft.json');
    var rotateInDownRight = require('./animations/rotateInDownRight.json');
    var rotateInUpLeft = require('./animations/rotateInUpLeft.json');
    var rotateInUpRight = require('./animations/rotateInUpRight.json');
    var rotateOut = require('./animations/rotateOut.json');
    var rotateOutDownLeft = require('./animations/rotateOutDownLeft.json');
    var rotateOutDownRight = require('./animations/rotateOutDownRight.json');
    var rotateOutUpLeft = require('./animations/rotateOutUpLeft.json');
    var rotateOutUpRight = require('./animations/rotateOutUpRight.json');
    var rubberBand = require('./animations/rubberBand.json');
    var shake = require('./animations/shake.json');
    var slideInDown = require('./animations/slideInDown.json');
    var slideInLeft = require('./animations/slideInLeft.json');
    var slideInRight = require('./animations/slideInRight.json');
    var slideInUp = require('./animations/slideInUp.json');
    var slideOutDown = require('./animations/slideOutDown.json');
    var slideOutLeft = require('./animations/slideOutLeft.json');
    var slideOutRight = require('./animations/slideOutRight.json');
    var slideOutUp = require('./animations/slideOutUp.json');
    var swing = require('./animations/swing.json');
    var tada = require('./animations/tada.json');
    var wobble = require('./animations/wobble.json');
    var zoomIn = require('./animations/zoomIn.json');
    var zoomInDown = require('./animations/zoomInDown.json');
    var zoomInLeft = require('./animations/zoomInLeft.json');
    var zoomInRight = require('./animations/zoomInRight.json');
    var zoomInUp = require('./animations/zoomInUp.json');
    var zoomOut = require('./animations/zoomOut.json');
    var zoomOutDown = require('./animations/zoomOutDown.json');
    var zoomOutLeft = require('./animations/zoomOutLeft.json');
    var zoomOutRight = require('./animations/zoomOutRight.json');
    var zoomOutUp = require('./animations/zoomOutUp.json');


    var animations = Object.freeze({
    	bounce: bounce,
    	bounceIn: bounceIn,
    	bounceInDown: bounceInDown,
    	bounceInLeft: bounceInLeft,
    	bounceInRight: bounceInRight,
    	bounceInUp: bounceInUp,
    	bounceOut: bounceOut,
    	bounceOutDown: bounceOutDown,
    	bounceOutLeft: bounceOutLeft,
    	bounceOutRight: bounceOutRight,
    	bounceOutUp: bounceOutUp,
    	fadeIn: fadeIn,
    	fadeInDown: fadeInDown,
    	fadeInDownBig: fadeInDownBig,
    	fadeInLeft: fadeInLeft,
    	fadeInLeftBig: fadeInLeftBig,
    	fadeInRight: fadeInRight,
    	fadeInRightBig: fadeInRightBig,
    	fadeInUp: fadeInUp,
    	fadeInUpBig: fadeInUpBig,
    	fadeOut: fadeOut,
    	fadeOutDown: fadeOutDown,
    	fadeOutDownBig: fadeOutDownBig,
    	fadeOutLeft: fadeOutLeft,
    	fadeOutLeftBig: fadeOutLeftBig,
    	fadeOutRight: fadeOutRight,
    	fadeOutRightBig: fadeOutRightBig,
    	fadeOutUp: fadeOutUp,
    	fadeOutUpBig: fadeOutUpBig,
    	flash: flash,
    	flip: flip,
    	flipInX: flipInX,
    	flipInY: flipInY,
    	flipOutX: flipOutX,
    	flipOutY: flipOutY,
    	headShake: headShake,
    	hinge: hinge,
    	jello: jello,
    	lightSpeedIn: lightSpeedIn,
    	lightSpeedOut: lightSpeedOut,
    	pulse: pulse,
    	rollIn: rollIn,
    	rollOut: rollOut,
    	rotateIn: rotateIn,
    	rotateInDownLeft: rotateInDownLeft,
    	rotateInDownRight: rotateInDownRight,
    	rotateInUpLeft: rotateInUpLeft,
    	rotateInUpRight: rotateInUpRight,
    	rotateOut: rotateOut,
    	rotateOutDownLeft: rotateOutDownLeft,
    	rotateOutDownRight: rotateOutDownRight,
    	rotateOutUpLeft: rotateOutUpLeft,
    	rotateOutUpRight: rotateOutUpRight,
    	rubberBand: rubberBand,
    	shake: shake,
    	slideInDown: slideInDown,
    	slideInLeft: slideInLeft,
    	slideInRight: slideInRight,
    	slideInUp: slideInUp,
    	slideOutDown: slideOutDown,
    	slideOutLeft: slideOutLeft,
    	slideOutRight: slideOutRight,
    	slideOutUp: slideOutUp,
    	swing: swing,
    	tada: tada,
    	wobble: wobble,
    	zoomIn: zoomIn,
    	zoomInDown: zoomInDown,
    	zoomInLeft: zoomInLeft,
    	zoomInRight: zoomInRight,
    	zoomInUp: zoomInUp,
    	zoomOut: zoomOut,
    	zoomOutDown: zoomOutDown,
    	zoomOutLeft: zoomOutLeft,
    	zoomOutRight: zoomOutRight,
    	zoomOutUp: zoomOutUp
    });

    const animationManager = new AnimationManager();
    const allAnimations = Object.keys(animations).map((name) => animations[name]);
    animationManager.register(allAnimations);
    if (typeof angular !== 'undefined') {
        angular.module('just.animate', []).service('just', () => animationManager);
    }

}());
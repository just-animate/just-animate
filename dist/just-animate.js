(function () {
    'use strict';

    var ostring = Object.prototype.toString;
    var slice = Array.prototype.slice;
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
        for (var i = 0, len = items.length; i < len; i++) {
            fn(items[i]);
        }
    }
    function max(items, propertyName) {
        var max = '';
        for (var i = 0, len = items.length; i < len; i++) {
            var prop = items[i][propertyName];
            if (max < prop) {
                max = prop;
            }
        }
        return max;
    }
    function map(items, fn) {
        var results = [];
        for (var i = 0, len = items.length; i < len; i++) {
            var result = fn(items[i]);
            if (result !== undefined) {
                results.push(result);
            }
        }
        return results;
    }
    function extend(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        for (var i = 1, len = arguments.length; i < len; i++) {
            var source = arguments[i];
            for (var propName in source) {
                target[propName] = source[propName];
            }
        }
        return target;
    }
    function multiapply(targets, fnName, args, cb) {
        var errors = [];
        var results = [];
        for (var i = 0, len = targets.length; i < len; i++) {
            try {
                var target = targets[i];
                var result = void 0;
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

    var easings = {
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

    var ElementAnimator = (function () {
        function ElementAnimator(manager, keyframesOrName, el, timings) {
            var _this = this;
            if (!keyframesOrName) {
                return;
            }
            var keyframes;
            if (isString(keyframesOrName)) {
                var definition = manager.findAnimation(keyframesOrName);
                keyframes = definition.keyframes;
                timings = extend({}, definition.timings, timings);
            }
            else {
                keyframes = keyframesOrName;
            }
            if (timings && timings.easing) {
                var easing = easings[timings.easing];
                if (easing) {
                    timings.easing = easing;
                }
            }
            this.duration = timings.duration;
            var elements = getElements(el);
            this._animators = multiapply(elements, 'animate', [keyframes, timings]);
            if (this._animators.length > 0) {
                this._animators[0].onfinish = function () {
                    _this.finish();
                };
            }
        }
        Object.defineProperty(ElementAnimator.prototype, "playbackRate", {
            get: function () {
                var first = head(this._animators);
                return first ? first.playbackRate : 0;
            },
            set: function (val) {
                each(this._animators, function (a) { return a.playbackRate = val; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementAnimator.prototype, "currentTime", {
            get: function () {
                return max(this._animators, 'currentTime') || 0;
            },
            set: function (elapsed) {
                each(this._animators, function (a) { return a.currentTime = elapsed; });
            },
            enumerable: true,
            configurable: true
        });
        ElementAnimator.prototype.finish = function (fn) {
            var _this = this;
            multiapply(this._animators, 'finish', [], fn);
            if (this.playbackRate < 0) {
                each(this._animators, function (a) { return a.currentTime = 0; });
            }
            else {
                each(this._animators, function (a) { return a.currentTime = _this.duration; });
            }
            if (isFunction(this.onfinish)) {
                this.onfinish(this);
            }
            return this;
        };
        ElementAnimator.prototype.play = function (fn) {
            multiapply(this._animators, 'play', [], fn);
            return this;
        };
        ElementAnimator.prototype.pause = function (fn) {
            multiapply(this._animators, 'pause', [], fn);
            return this;
        };
        ElementAnimator.prototype.reverse = function (fn) {
            multiapply(this._animators, 'reverse', [], fn);
            return this;
        };
        ElementAnimator.prototype.cancel = function (fn) {
            multiapply(this._animators, 'cancel', [], fn);
            each(this._animators, function (a) { return a.currentTime = 0; });
            if (isFunction(this.oncancel)) {
                this.oncancel(this);
            }
            return this;
        };
        return ElementAnimator;
    }());
    function getElements(source) {
        if (!source) {
            throw Error('source is undefined');
        }
        if (isString(source)) {
            var nodeResults = document.querySelectorAll(source);
            return toArray(nodeResults);
        }
        if (source instanceof Element) {
            return [source];
        }
        if (isFunction(source)) {
            var provider = source;
            var result = provider();
            return getElements(result);
        }
        if (isArray(source)) {
            var elements_1 = [];
            each(source, function (i) {
                var innerElements = getElements(i);
                elements_1.push.apply(elements_1, innerElements);
            });
            return elements_1;
        }
        return [];
    }

    var SequenceAnimator = (function () {
        function SequenceAnimator(manager, options) {
            var steps = map(options.steps, function (step) {
                if (step.command || !step.name) {
                    return step;
                }
                var definition = manager.findAnimation(step.name);
                var timings = extend({}, definition.timings);
                if (step.timings) {
                    timings = extend(timings, step.timings);
                }
                return {
                    el: step.el,
                    keyframes: definition.keyframes,
                    timings: definition.timings
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
        Object.defineProperty(SequenceAnimator.prototype, "currentTime", {
            get: function () {
                var currentIndex = this._currentIndex;
                var len = this._steps.length;
                if (currentIndex === -1 || currentIndex === len) {
                    return 0;
                }
                var isReversed = this.playbackRate === -1;
                var beforeTime = 0;
                var afterTime = 0;
                var currentTime;
                for (var i = 0; i < len; i++) {
                    var step = this._steps[i];
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SequenceAnimator.prototype, "duration", {
            get: function () {
                return this._steps.reduce(function (c, n) { return c + (n.timings.duration || 0); }, 0);
            },
            enumerable: true,
            configurable: true
        });
        SequenceAnimator.prototype.finish = function (fn) {
            this._errorCallback = fn;
            this._currentIndex = -1;
            for (var x = 0; x < this._steps.length; x++) {
                var step = this._steps[x];
                if (step.animator !== undefined) {
                    step.animator.cancel(fn);
                }
            }
            if (isFunction(this.onfinish)) {
                this.onfinish(this);
            }
            return this;
        };
        SequenceAnimator.prototype.play = function (fn) {
            this._errorCallback = fn;
            this.playbackRate = 1;
            this._playThisStep();
            return this;
        };
        SequenceAnimator.prototype.pause = function (fn) {
            this._errorCallback = fn;
            if (!this._isInEffect()) {
                return this;
            }
            var animator = this._getAnimator();
            animator.pause(fn);
            return this;
        };
        SequenceAnimator.prototype.reverse = function (fn) {
            this._errorCallback = fn;
            this.playbackRate = -1;
            this._playThisStep();
            return this;
        };
        SequenceAnimator.prototype.cancel = function (fn) {
            this._errorCallback = fn;
            this.playbackRate = undefined;
            this._currentIndex = -1;
            for (var x = 0; x < this._steps.length; x++) {
                var step = this._steps[x];
                if (step.animator !== undefined) {
                    step.animator.cancel(fn);
                }
            }
            if (isFunction(this.oncancel)) {
                this.oncancel(this);
            }
            return this;
        };
        SequenceAnimator.prototype._isInEffect = function () {
            return this._currentIndex > -1 && this._currentIndex < this._steps.length;
        };
        SequenceAnimator.prototype._getAnimator = function () {
            var it = this._steps[this._currentIndex];
            if (it.animator) {
                return it.animator;
            }
            it.animator = this._manager.animate(it.keyframes, it.el, it.timings);
            return it.animator;
        };
        SequenceAnimator.prototype._playNextStep = function (evt) {
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
        };
        SequenceAnimator.prototype._playThisStep = function () {
            var _this = this;
            if (!this._isInEffect()) {
                if (this.playbackRate === -1) {
                    this._currentIndex = this._steps.length - 1;
                }
                else {
                    this._currentIndex = 0;
                }
            }
            var animator = this._getAnimator();
            animator.onfinish = function (evt) {
                _this._playNextStep(evt);
            };
            animator.play(this._errorCallback);
        };
        return SequenceAnimator;
    }());

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
            this._events = map(options.events, function (evt) { return new TimelineEvent(manager, duration, evt); });
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
            each(this._events, function (evt) {
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
            each(this._events, function (evt) { return evt.animator.finish(); });
            if (isFunction(this.onfinish)) {
                this.onfinish(this);
            }
        };
        TimelineAnimator.prototype._triggerCancel = function () {
            this._reset();
            each(this._events, function (evt) { return evt.animator.cancel(); });
            if (isFunction(this.oncancel)) {
                this.oncancel(this);
            }
        };
        TimelineAnimator.prototype._triggerPause = function () {
            this._isPaused = true;
            this._isInEffect = false;
            this._lastTick = undefined;
            this.playbackRate = 0;
            each(this._events, function (evt) {
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
            each(this._events, function (evt) {
                evt.isInEffect = false;
            });
        };
        return TimelineAnimator;
    }());
    var TimelineEvent = (function () {
        function TimelineEvent(manager, timelineDuration, evt) {
            var keyframes;
            var timings;
            var el;
            if (evt.name) {
                var definition = manager.findAnimation(evt.name);
                var timings2 = extend({}, definition.timings);
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

    var AnimationManager = (function () {
        function AnimationManager() {
            this._registry = {};
            this._timings = {
                duration: 1000,
                fill: 'both'
            };
        }
        AnimationManager.prototype.animate = function (keyframesOrName, el, timings) {
            return new ElementAnimator(this, keyframesOrName, el, timings);
        };
        AnimationManager.prototype.animateSequence = function (options) {
            return new SequenceAnimator(this, options);
        };
        AnimationManager.prototype.animateTimeline = function (options) {
            return new TimelineAnimator(this, options);
        };
        AnimationManager.prototype.configure = function (timings) {
            if (timings) {
                extend(this._timings, timings);
            }
            return this;
        };
        AnimationManager.prototype.findAnimation = function (name) {
            return this._registry[name] || undefined;
        };
        AnimationManager.prototype.register = function (animationOptions) {
            var self = this;
            var registerAnimation = function (it) {
                self[name] = function (el, timings) { return self.animate(it.name, el, it.timings); };
                self._registry[it.name] = it;
            };
            if (isArray(animationOptions)) {
                each(animationOptions, registerAnimation);
            }
            else {
                self[name] = function (el, timings) {
                    return self.animate(animationOptions.name, el, animationOptions.timings);
                };
                self._registry[animationOptions.name] = animationOptions;
            }
            return self;
        };
        return AnimationManager;
    }());

    var bounce = {
        'keyframes': [
            {
                'offset': 0,
                'transform': 'translate3d(0, 0, 0)'
            },
            {
                'offset': 0.2,
                'transform': 'translate3d(0, 0, 0)'
            },
            {
                'offset': 0.4,
                'transform': 'translate3d(0, -30px, 0)'
            },
            {
                'offset': 0.43,
                'transform': 'translate3d(0, -30px, 0)'
            },
            {
                'offset': 0.53,
                'transform': 'translate3d(0, 0, 0)'
            },
            {
                'offset': 0.7,
                'transform': 'translate3d(0, -15px, 0)'
            },
            {
                'offset': 0.8,
                'transform': 'translate3d(0, 0, 0)'
            },
            {
                'offset': 0.9,
                'transform': 'translate3d(0, -4px, 0)'
            },
            {
                'offset': 1,
                'transform': 'translate3d(0, 0, 0)'
            }
        ],
        'timings': {
            'duration': 900,
            'fill': 'both',
            'easing': 'easeOutCubic'
        },
        'name': 'bounce'
    };

    var bounceIn = {
        'keyframes': [
            {
                'opacity': 0,
                'transform': 'scale3d(.3, .3, .3)'
            },
            {
                'transform': 'scale3d(1.1, 1.1, 1.1)'
            },
            {
                'transform': 'scale3d(.9, .9, .9)'
            },
            {
                'opacity': 1,
                'transform': 'scale3d(1.03, 1.03, 1.03)'
            },
            {
                'transform': 'scale3d(.97, .97, .97)'
            },
            {
                'opacity': 1,
                'transform': 'scale3d(1, 1, 1)'
            }
        ],
        'timings': {
            'duration': 900,
            'fill': 'both',
            'easing': 'easeOutCubic'
        },
        'name': 'bounceIn'
    };

    var bounceInDown = {
        'keyframes': [
            {
                'offset': 0,
                'easing': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                'opacity': 0,
                'transform': 'translate3d(0, -3000px, 0)'
            },
            {
                'offset': 0.6,
                'easing': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                'opacity': 1,
                'transform': 'translate3d(0, 25px, 0)'
            },
            {
                'offset': 0.75,
                'easing': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                'opacity': 1,
                'transform': 'translate3d(0, -10px, 0)'
            },
            {
                'offset': 0.9,
                'easing': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                'opacity': 1,
                'transform': 'translate3d(0, 5px, 0)'
            },
            {
                'offset': 1,
                'easing': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 900,
            'fill': 'both',
            'easing': 'easeOutCubic'
        },
        'name': 'bounceInDown'
    };

    var bounceInLeft = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 0,
                'transform': 'translate3d(-3000px, 0, 0)'
            },
            {
                'offset': 0.6,
                'opacity': 1,
                'transform': 'translate3d(25px, 0, 0)'
            },
            {
                'offset': 0.75,
                'opacity': 1,
                'transform': 'translate3d(-10px, 0, 0)'
            },
            {
                'offset': 0.9,
                'opacity': 1,
                'transform': 'translate3d(5px, 0, 0)'
            },
            {
                'offset': 1,
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 900,
            'fill': 'both',
            'easing': 'easeOutCubic'
        },
        'name': 'bounceInLeft'
    };

    var bounceInRight = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 0,
                'transform': 'translate3d(3000px, 0, 0)'
            },
            {
                'offset': 0.6,
                'opacity': 1,
                'transform': 'translate3d(-25px, 0, 0)'
            },
            {
                'offset': 0.75,
                'transform': 'translate3d(10px, 0, 0)'
            },
            {
                'offset': 0.9,
                'transform': 'translate3d(-5px, 0, 0)'
            },
            {
                'offset': 1,
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 900,
            'fill': 'both',
            'easing': 'easeOutCubic'
        },
        'name': 'bounceInRight'
    };

    var bounceInUp = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 0,
                'transform': 'translate3d(0, 3000px, 0)'
            },
            {
                'offset': 0.6,
                'opacity': 1,
                'transform': 'translate3d(0, -20px, 0)'
            },
            {
                'offset': 0.75,
                'opacity': 1,
                'transform': 'translate3d(0, 10px, 0)'
            },
            {
                'offset': 0.9,
                'opacity': 1,
                'transform': 'translate3d(0, -5px, 0)'
            },
            {
                'offset': 1,
                'opacity': 1,
                'transform': 'translate3d(0, 0, 0)'
            }
        ],
        'timings': {
            'duration': 900,
            'fill': 'both',
            'easing': 'easeOutCubic'
        },
        'name': 'bounceInUp'
    };

    var bounceOut = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 1,
                'transform': 'none'
            },
            {
                'offset': 0.2,
                'transform': 'scale3d(.9, .9, .9)'
            },
            {
                'offset': 0.5,
                'opacity': 1,
                'transform': 'scale3d(1.1, 1.1, 1.1)'
            },
            {
                'offset': 0.55,
                'opacity': 1,
                'transform': 'scale3d(1.1, 1.1, 1.1)'
            },
            {
                'offset': 1,
                'opacity': 0,
                'transform': 'scale3d(.3, .3, .3)'
            }
        ],
        'timings': {
            'duration': 900,
            'fill': 'both'
        },
        'name': 'bounceOut'
    };

    var bounceOutDown = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 1,
                'transform': 'none'
            },
            {
                'offset': 0.2,
                'transform': 'translate3d(0, 10px, 0)'
            },
            {
                'offset': 0.4,
                'opacity': 1,
                'transform': 'translate3d(0, -20px, 0)'
            },
            {
                'offset': 0.45,
                'opacity': 1,
                'transform': 'translate3d(0, -20px, 0)'
            },
            {
                'offset': 1,
                'opacity': 0,
                'transform': 'translate3d(0, 2000px, 0)'
            }
        ],
        'timings': {
            'duration': 900,
            'fill': 'both'
        },
        'name': 'bounceOutDown'
    };

    var bounceOutLeft = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 1,
                'transform': 'none'
            },
            {
                'offset': 0.2,
                'opacity': 1,
                'transform': 'translate3d(20px, 0, 0)'
            },
            {
                'offset': 1,
                'opacity': 0,
                'transform': 'translate3d(-2000px, 0, 0)'
            }
        ],
        'timings': {
            'duration': 900,
            'fill': 'both'
        },
        'name': 'bounceOutLeft'
    };

    var bounceOutRight = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 1,
                'transform': 'none'
            },
            {
                'offset': 0.2,
                'opacity': 1,
                'transform': 'translate3d(-20px, 0, 0)'
            },
            {
                'offset': 1,
                'opacity': 0,
                'transform': 'translate3d(2000px, 0, 0)'
            }
        ],
        'timings': {
            'duration': 900,
            'fill': 'both'
        },
        'name': 'bounceOutRight'
    };

    var bounceOutUp = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 1,
                'transform': 'none'
            },
            {
                'offset': 0.2,
                'opacity': 1,
                'transform': 'translate3d(0, -10px, 0)'
            },
            {
                'offset': 0.4,
                'opacity': 1,
                'transform': 'translate3d(0, 20px, 0)'
            },
            {
                'offset': 0.45,
                'opacity': 1,
                'transform': 'translate3d(0, 20px, 0)'
            },
            {
                'offset': 1,
                'opacity': 0,
                'transform': 'translate3d(0, -2000px, 0)'
            }
        ],
        'timings': {
            'duration': 900,
            'fill': 'both'
        },
        'name': 'bounceOutUp'
    };

    var fadeIn = {
        'keyframes': [
            {
                'opacity': 0
            },
            {
                'opacity': 1
            }
        ],
        'timings': {
            'duration': 650,
            'fill': 'both',
            'easing': 'ease-in'
        },
        'name': 'fadeIn'
    };

    var fadeInDown = {
        'keyframes': [
            {
                'opacity': 0,
                'transform': 'translate3d(0, -100%, 0)'
            },
            {
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 650,
            'fill': 'both'
        },
        'name': 'fadeInDown'
    };

    var fadeInDownBig = {
        'keyframes': [
            {
                'opacity': 0,
                'transform': 'translate3d(0, -2000px, 0)'
            },
            {
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 1300,
            'fill': 'both'
        },
        'name': 'fadeInDownBig'
    };

    var fadeInLeft = {
        'keyframes': [
            {
                'opacity': 0,
                'transform': 'translate3d(-100%, 0, 0)'
            },
            {
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 650,
            'fill': 'both'
        },
        'name': 'fadeInLeft'
    };

    var fadeInLeftBig = {
        'keyframes': [
            {
                'opacity': 0,
                'transform': 'translate3d(-2000px, 0, 0)'
            },
            {
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 1300,
            'fill': 'both'
        },
        'name': 'fadeInLeftBig'
    };

    var fadeInRight = {
        'keyframes': [
            {
                'opacity': 0,
                'transform': 'translate3d(100%, 0, 0)'
            },
            {
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 650,
            'fill': 'both'
        },
        'name': 'fadeInRight'
    };

    var fadeInRightBig = {
        'keyframes': [
            {
                'opacity': 0,
                'transform': 'translate3d(2000px, 0, 0)'
            },
            {
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 1300,
            'fill': 'both'
        },
        'name': 'fadeInRightBig'
    };

    var fadeInUp = {
        'keyframes': [
            {
                'opacity': 0,
                'transform': 'translate3d(0, 100%, 0)'
            },
            {
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 650,
            'fill': 'both'
        },
        'name': 'fadeInUp'
    };

    var fadeInUpBig = {
        'keyframes': [
            {
                'opacity': 0,
                'transform': 'translate3d(0, 2000px, 0)'
            },
            {
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 1300,
            'fill': 'both'
        },
        'name': 'fadeInUpBig'
    };

    var fadeOut = {
        'keyframes': [
            {
                'opacity': 1
            },
            {
                'opacity': 0
            }
        ],
        'timings': {
            'duration': 650,
            'fill': 'both'
        },
        'name': 'fadeOut'
    };

    var fadeOutDown = {
        'keyframes': [
            {
                'opacity': 1,
                'transform': 'none'
            },
            {
                'opacity': 0,
                'transform': 'translate3d(0, 100%, 0)'
            }
        ],
        'timings': {
            'duration': 650
        },
        'name': 'fadeOutDown'
    };

    var fadeOutDownBig = {
        'keyframes': [
            {
                'opacity': 1,
                'transform': 'none'
            },
            {
                'opacity': 0,
                'transform': 'translate3d(0, 2000px, 0)'
            }
        ],
        'timings': {
            'duration': 1300
        },
        'name': 'fadeOutDownBig'
    };

    var fadeOutLeft = {
        'keyframes': [
            {
                'opacity': 1,
                'transform': 'none'
            },
            {
                'opacity': 0,
                'transform': 'translate3d(-100%, 0, 0)'
            }
        ],
        'timings': {
            'duration': 650
        },
        'name': 'fadeOutLeft'
    };

    var fadeOutLeftBig = {
        'keyframes': [
            {
                'opacity': 1,
                'transform': 'none'
            },
            {
                'opacity': 0,
                'transform': 'translate3d(-2000px, 0, 0)'
            }
        ],
        'timings': {
            'duration': 1300
        },
        'name': 'fadeOutLeftBig'
    };

    var fadeOutRight = {
        'keyframes': [
            {
                'opacity': 1,
                'transform': 'none'
            },
            {
                'opacity': 0,
                'transform': 'translate3d(100%, 0, 0)'
            }
        ],
        'timings': {
            'duration': 650
        },
        'name': 'fadeOutRight'
    };

    var fadeOutRightBig = {
        'keyframes': [
            {
                'opacity': 1,
                'transform': 'none'
            },
            {
                'opacity': 0,
                'transform': 'translate3d(2000px, 0, 0)'
            }
        ],
        'timings': {
            'duration': 1300
        },
        'name': 'fadeOutRightBig'
    };

    var fadeOutUp = {
        'keyframes': [
            {
                'opacity': 1,
                'transform': 'none'
            },
            {
                'opacity': 0,
                'transform': 'translate3d(0, -100%, 0)'
            }
        ],
        'timings': {
            'duration': 650
        },
        'name': 'fadeOutUp'
    };

    var fadeOutUpBig = {
        'keyframes': [
            {
                'opacity': 1,
                'transform': 'none'
            },
            {
                'opacity': 0,
                'transform': 'translate3d(0, -2000px, 0)'
            }
        ],
        'timings': {
            'duration': 1300
        },
        'name': 'fadeOutUpBig'
    };

    var flash = {
        'keyframes': [
            {
                'opacity': 1
            },
            {
                'opacity': 0
            },
            {
                'opacity': 1
            },
            {
                'opacity': 0
            },
            {
                'opacity': 1
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'flash'
    };

    var flip = {
        'keyframes': [
            {
                'offset': 0,
                'transform': 'perspective(400px) rotate3d(0, 1, 0, -360deg)'
            },
            {
                'offset': 0.4,
                'transform': 'perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg)'
            },
            {
                'offset': 0.5,
                'transform': 'perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg)'
            },
            {
                'offset': 0.8,
                'transform': 'perspective(400px) scale3d(.95, .95, .95)'
            },
            {
                'offset': 1,
                'transform': 'perspective(400px)'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'flip'
    };

    var flipInX = {
        'keyframes': [
            {
                'offset': 0,
                'transform': 'perspective(400px) rotate3d(1, 0, 0, 90deg)',
                'easing': 'ease-in ',
                'opacity': 0
            },
            {
                'offset': 0.4,
                'transform': 'perspective(400px) rotate3d(1, 0, 0, -20deg)',
                'easing': 'ease-in '
            },
            {
                'offset': 0.6,
                'transform': 'perspective(400px) rotate3d(1, 0, 0, 10deg)',
                'opacity': 1
            },
            {
                'offset': 0.8,
                'transform': 'perspective(400px) rotate3d(1, 0, 0, -5deg)'
            },
            {
                'offset': 1,
                'opacity': 1,
                'transform': 'perspective(400px)'
            }
        ],
        'timings': {
            'duration': 750
        },
        'name': 'flipInX'
    };

    var flipInY = {
        'keyframes': [
            {
                'offset': 0,
                'transform': 'perspective(400px) rotate3d(0, 1, 0, 90deg)',
                'opacity': 0
            },
            {
                'offset': 0.4,
                'transform': 'perspective(400px) rotate3d(0, 1, 0, -20deg)'
            },
            {
                'offset': 0.6,
                'transform': 'perspective(400px) rotate3d(0, 1, 0, 10deg)',
                'opacity': 1
            },
            {
                'offset': 0.8,
                'transform': 'perspective(400px) rotate3d(0, 1, 0, -5deg)'
            },
            {
                'offset': 1,
                'transform': 'perspective(400px)',
                'opacity': 1
            }
        ],
        'timings': {
            'duration': 750
        },
        'name': 'flipInY'
    };

    var flipOutX = {
        'keyframes': [
            {
                'offset': 0,
                'transform': 'perspective(400px)',
                'opacity': 1
            },
            {
                'offset': 0.3,
                'transform': 'perspective(400px) rotate3d(1, 0, 0, -20deg)',
                'opacity': 1
            },
            {
                'offset': 1,
                'transform': 'perspective(400px) rotate3d(1, 0, 0, 90deg)',
                'opacity': 0
            }
        ],
        'timings': {
            'duration': 750
        },
        'name': 'flipOutX'
    };

    var flipOutY = {
        'keyframes': [
            {
                'offset': 0,
                'transform': 'perspective(400px)',
                'opacity': 1
            },
            {
                'offset': 0.3,
                'transform': 'perspective(400px) rotate3d(0, 1, 0, -15deg)',
                'opacity': 1
            },
            {
                'offset': 1,
                'transform': 'perspective(400px) rotate3d(0, 1, 0, 90deg)',
                'opacity': 0
            }
        ],
        'timings': {
            'duration': 750
        },
        'name': 'flipOutY'
    };

    var headShake = {
        'keyframes': [
            {
                'offset': 0,
                'transform': 'translateX(0)'
            },
            {
                'offset': 0.065,
                'transform': 'translateX(-6px) rotateY(-9deg)'
            },
            {
                'offset': 0.185,
                'transform': 'translateX(5px) rotateY(7deg)'
            },
            {
                'offset': 0.315,
                'transform': 'translateX(-3px) rotateY(-5deg)'
            },
            {
                'offset': 0.435,
                'transform': 'translateX(2px) rotateY(3deg)'
            },
            {
                'offset': 0.5,
                'transform': 'translateX(0)'
            },
            {
                'offset': 1,
                'transform': 'translateX(0)'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'headShake'
    };

    var hinge = {
        'keyframes': [
            {
                'transform': 'none',
                'transform-origin': 'top left',
                'opacity': 1
            },
            {
                'transform': 'rotate3d(0, 0, 1, 80deg)',
                'opacity': 1
            },
            {
                'transform': 'rotate3d(0, 0, 1, 60deg)',
                'opacity': 1
            },
            {
                'transform': 'rotate3d(0, 0, 1, 80deg)',
                'opacity': 0
            },
            {
                'transform': 'rotate3d(0, 0, 1, 60deg)',
                'opacity': 1
            },
            {
                'transform': 'translate3d(0, 700px, 0)',
                'transform-origin': 'top left',
                'opacity': 0
            }
        ],
        'timings': {
            'duration': 2000
        },
        'name': 'hinge'
    };

    var jello = {
        'keyframes': [
            {
                'offset': 0,
                'transform': 'none'
            },
            {
                'offset': 0.111,
                'transform': 'none'
            },
            {
                'offset': 0.222,
                'transform': 'skewX(-12.5deg) skewY(-12.5deg)'
            },
            {
                'offset': 0.333,
                'transform': 'skewX(6.25deg) skewY(6.25deg)'
            },
            {
                'offset': 0.444,
                'transform': 'skewX(-3.125deg) skewY(-3.125deg)'
            },
            {
                'offset': 0.555,
                'transform': 'skewX(1.5625deg) skewY(1.5625deg)'
            },
            {
                'offset': 0.666,
                'transform': 'skewX(-0.78125deg) skewY(-0.78125deg)'
            },
            {
                'offset': 0.777,
                'transform': 'skewX(0.390625deg) skewY(0.390625deg)'
            },
            {
                'offset': 0.888,
                'transform': 'skewX(-0.1953125deg) skewY(-0.1953125deg)'
            },
            {
                'offset': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 1000,
            'fill': 'both',
            'easing': 'ease-in-out'
        },
        'name': 'jello'
    };

    var lightSpeedIn = {
        'keyframes': [
            {
                'offset': 0,
                'transform': 'translate3d(100%, 0, 0) skewX(-30deg)',
                'opacity': 0
            },
            {
                'offset': 0.6,
                'transform': 'skewX(20deg)',
                'opacity': 1
            },
            {
                'offset': 0.8,
                'transform': 'skewX(-5deg)',
                'opacity': 1
            },
            {
                'offset': 1,
                'transform': 'none',
                'opacity': 1
            }
        ],
        'timings': {
            'duration': 1000,
            'fill': 'both',
            'easing': 'ease-out'
        },
        'name': 'lightSpeedIn'
    };

    var lightSpeedOut = {
        'keyframes': [
            {
                'transform': 'none',
                'opacity': 1
            },
            {
                'transform': 'translate3d(100%, 0, 0) skewX(30deg)',
                'opacity': 0
            }
        ],
        'timings': {
            'duration': 1000,
            'fill': 'both',
            'easing': 'ease-in'
        },
        'name': 'lightSpeedOut'
    };

    var pulse = {
        'keyframes': [
            {
                'transform': 'scale3d(1, 1, 1)'
            },
            {
                'transform': 'scale3d(1.05, 1.05, 1.05)'
            },
            {
                'transform': 'scale3d(1, 1, 1)'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'pulse'
    };

    var rollIn = {
        'keyframes': [
            {
                'opacity': 0,
                'transform': 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)'
            },
            {
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'rollIn'
    };

    var rollOut = {
        'keyframes': [
            {
                'opacity': 1,
                'transform': 'none'
            },
            {
                'opacity': 0,
                'transform': 'translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'rollOut'
    };

    var rotateIn = {
        'keyframes': [
            {
                'transform-origin': 'center',
                'transform': 'rotate3d(0, 0, 1, -200deg)',
                'opacity': 0
            },
            {
                'transform-origin': 'center',
                'transform': 'none',
                'opacity': 1
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'rotateIn'
    };

    var rotateInDownLeft = {
        'keyframes': [
            {
                'transform-origin': 'left bottom',
                'transform': 'rotate3d(0, 0, 1, -45deg)',
                'opacity': 0
            },
            {
                'transform-origin': 'left bottom',
                'transform': 'none',
                'opacity': 1
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'rotateInDownLeft'
    };

    var rotateInDownRight = {
        'keyframes': [
            {
                'transform-origin': 'right bottom',
                'transform': 'rotate3d(0, 0, 1, 45deg)',
                'opacity': 0
            },
            {
                'transform-origin': 'right bottom',
                'transform': 'none',
                'opacity': 1
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'rotateInDownRight'
    };

    var rotateInUpLeft = {
        'keyframes': [
            {
                'transform-origin': 'left bottom',
                'transform': 'rotate3d(0, 0, 1, 45deg)',
                'opacity': 0
            },
            {
                'transform-origin': 'left bottom',
                'transform': 'none',
                'opacity': 1
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'rotateInUpLeft'
    };

    var rotateInUpRight = {
        'keyframes': [
            {
                'transform-origin': 'right bottom',
                'transform': 'rotate3d(0, 0, 1, -90deg)',
                'opacity': 0
            },
            {
                'transform-origin': 'right bottom',
                'transform': 'none',
                'opacity': 1
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'rotateInUpRight'
    };

    var rotateOut = {
        'keyframes': [
            {
                'transform-origin': 'center',
                'transform': 'none',
                'opacity': 1
            },
            {
                'transform-origin': 'center',
                'transform': 'rotate3d(0, 0, 1, 200deg)',
                'opacity': 0
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'rotateOut'
    };

    var rotateOutDownLeft = {
        'keyframes': [
            {
                'transform-origin': 'left bottom',
                'transform': 'none',
                'opacity': 1
            },
            {
                'transform-origin': 'left bottom',
                'transform': 'rotate3d(0, 0, 1, 45deg)',
                'opacity': 0
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'rotateOutDownLeft'
    };

    var rotateOutDownRight = {
        'keyframes': [
            {
                'transform-origin': 'right bottom',
                'transform': 'none',
                'opacity': 1
            },
            {
                'transform-origin': 'right bottom',
                'transform': 'rotate3d(0, 0, 1, -45deg)',
                'opacity': 0
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'rotateOutDownRight'
    };

    var rotateOutUpLeft = {
        'keyframes': [
            {
                'transform-origin': 'left bottom',
                'transform': 'none',
                'opacity': 1
            },
            {
                'transform-origin': 'left bottom',
                'transform': 'rotate3d(0, 0, 1, -45deg)',
                'opacity': 0
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'rotateOutUpLeft'
    };

    var rotateOutUpRight = {
        'keyframes': [
            {
                'transform-origin': 'right bottom',
                'transform': 'none',
                'opacity': 1
            },
            {
                'transform-origin': 'right bottom',
                'transform': 'rotate3d(0, 0, 1, 90deg)',
                'opacity': 0
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'rotateOutUpRight'
    };

    var rubberBand = {
        'keyframes': [
            {
                'offset': 0,
                'transform': 'scale3d(1, 1, 1)'
            },
            {
                'offset': 0.3,
                'transform': 'scale3d(1.25, 0.75, 1)'
            },
            {
                'offset': 0.4,
                'transform': 'scale3d(0.75, 1.25, 1)'
            },
            {
                'offset': 0.5,
                'transform': 'scale3d(1.15, 0.85, 1)'
            },
            {
                'offset': 0.65,
                'transform': 'scale3d(.95, 1.05, 1)'
            },
            {
                'offset': 0.75,
                'transform': 'scale3d(1.05, .95, 1)'
            },
            {
                'offset': 1,
                'transform': 'scale3d(1, 1, 1)'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'rubberBand'
    };

    var shake = {
        'keyframes': [
            {
                'transform': 'translate3d(0, 0, 0)'
            },
            {
                'transform': 'translate3d(-10px, 0, 0)'
            },
            {
                'transform': 'translate3d(10px, 0, 0)'
            },
            {
                'transform': 'translate3d(-10px, 0, 0)'
            },
            {
                'transform': 'translate3d(10px, 0, 0)'
            },
            {
                'transform': 'translate3d(-10px, 0, 0)'
            },
            {
                'transform': 'translate3d(10px, 0, 0)'
            },
            {
                'transform': 'translate3d(-10px, 0, 0)'
            },
            {
                'transform': 'translate3d(10px, 0, 0)'
            },
            {
                'transform': 'translate3d(-10px, 0, 0)'
            },
            {
                'transform': 'translate3d(0, 0, 0)'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'shake'
    };

    var slideInDown = {
        'keyframes': [
            {
                'transform': 'translate3d(0, -100%, 0)',
                'visibility': 'hidden'
            },
            {
                'transform': 'translate3d(0, 0, 0)',
                'visibility': 'visible'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'slideInDown'
    };

    var slideInLeft = {
        'keyframes': [
            {
                'transform': 'translate3d(-100%, 0, 0)',
                'visibility': 'hidden'
            },
            {
                'transform': 'translate3d(0, 0, 0)',
                'visibility': 'visible'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'slideInLeft'
    };

    var slideInRight = {
        'keyframes': [
            {
                'transform': 'translate3d(100%, 0, 0)',
                'visibility': 'hidden'
            },
            {
                'transform': 'translate3d(0, 0, 0)',
                'visibility': 'visible'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'slideInRight'
    };

    var slideInUp = {
        'keyframes': [
            {
                'transform': 'translate3d(0, 100%, 0)',
                'visibility': 'hidden'
            },
            {
                'transform': 'translate3d(0, 0, 0)',
                'visibility': 'visible'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'slideInUp'
    };

    var slideOutDown = {
        'keyframes': [
            {
                'transform': 'translate3d(0, 0, 0)',
                'visibility': 'visible'
            },
            {
                'visibility': 'hidden',
                'transform': 'translate3d(0, 100%, 0)'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'slideOutDown'
    };

    var slideOutLeft = {
        'keyframes': [
            {
                'visibility': 'visible',
                'transform': 'translate3d(0, 0, 0)'
            },
            {
                'visibility': 'hidden',
                'transform': 'translate3d(-100%, 0, 0)'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'slideOutLeft'
    };

    var slideOutRight = {
        'keyframes': [
            {
                'visibility': 'visible',
                'transform': 'translate3d(0, 0, 0)'
            },
            {
                'visibility': 'hidden',
                'transform': 'translate3d(100%, 0, 0)'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'slideOutRight'
    };

    var slideOutUp = {
        'keyframes': [
            {
                'visibility': 'visible',
                'transform': 'translate3d(0, 0, 0)'
            },
            {
                'visibility': 'hidden',
                'transform': 'translate3d(0, -100%, 0)'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'slideOutUp'
    };

    var swing = {
        'keyframes': [
            {
                'transform': 'none'
            },
            {
                'transform': 'rotate3d(0, 0, 1, 15deg)'
            },
            {
                'transform': 'rotate3d(0, 0, 1, -10deg)'
            },
            {
                'transform': 'rotate3d(0, 0, 1, 5deg)'
            },
            {
                'transform': 'rotate3d(0, 0, 1, -5deg)'
            },
            {
                'transform': 'rotate3d(0, 0, 1, 0deg)'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'swing'
    };

    var tada = {
        'keyframes': [
            {
                'transform': 'scale3d(1, 1, 1)'
            },
            {
                'transform': 'scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)'
            },
            {
                'transform': 'scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)'
            },
            {
                'transform': 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)'
            },
            {
                'transform': 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)'
            },
            {
                'transform': 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)'
            },
            {
                'transform': 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)'
            },
            {
                'transform': 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)'
            },
            {
                'transform': 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)'
            },
            {
                'transform': 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)'
            },
            {
                'transform': 'scale3d(1, 1, 1)'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'tada'
    };

    var wobble = {
        'keyframes': [
            {
                'offset': 0,
                'transform': 'none'
            },
            {
                'offset': 0.15,
                'transform': 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)'
            },
            {
                'offset': 0.3,
                'transform': 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)'
            },
            {
                'offset': 0.45,
                'transform': 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)'
            },
            {
                'offset': 0.6,
                'transform': 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)'
            },
            {
                'offset': 0.75,
                'transform': 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)'
            },
            {
                'offset': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 1000
        },
        'name': 'wobble'
    };

    var zoomIn = {
        'keyframes': [
            {
                'opacity': 0,
                'transform': 'scale3d(.3, .3, .3)'
            },
            {
                'opacity': 1
            },
            {
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 1000,
            'easing': 'elegantSlowStartEnd'
        },
        'name': 'zoomIn'
    };

    var zoomInDown = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 0,
                'transform': 'scale3d(.1, .1, .1) translate3d(0, -1000px, 0)'
            },
            {
                'offset': 0.6,
                'opacity': 1,
                'transform': 'scale3d(.475, .475, .475) translate3d(0, 60px, 0)'
            },
            {
                'offset': 1,
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 1000,
            'easing': 'easeInCubic'
        },
        'name': 'zoomInDown'
    };

    var zoomInLeft = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 0,
                'transform': 'scale3d(.1, .1, .1) translate3d(-1000px, 0, 0)'
            },
            {
                'offset': 0.6,
                'opacity': 1,
                'transform': 'scale3d(.475, .475, .475) translate3d(10px, 0, 0)'
            },
            {
                'offset': 1,
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 1000,
            'easing': 'elegantSlowStartEnd'
        },
        'name': 'zoomInLeft'
    };

    var zoomInRight = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 0,
                'transform': 'scale3d(.1, .1, .1) translate3d(1000px, 0, 0)'
            },
            {
                'offset': 0.6,
                'opacity': 1,
                'transform': 'scale3d(.475, .475, .475) translate3d(-10px, 0, 0)'
            },
            {
                'offset': 1,
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 1000,
            'easing': 'elegantSlowStartEnd'
        },
        'name': 'zoomInRight'
    };

    var zoomInUp = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 0,
                'transform': 'scale3d(.1, .1, .1) translate3d(0, 1000px, 0)'
            },
            {
                'offset': 0.6,
                'opacity': 1,
                'transform': 'scale3d(.475, .475, .475) translate3d(0, -60px, 0)'
            },
            {
                'offset': 1,
                'opacity': 1,
                'transform': 'none'
            }
        ],
        'timings': {
            'duration': 1000,
            'easing': 'elegantSlowStartEnd'
        },
        'name': 'zoomInUp'
    };

    var zoomOut = {
        'keyframes': [
            {
                'opacity': 1,
                'transform': 'none',
                'transform-origin': 'center middle'
            },
            {
                'opacity': 0,
                'transform': 'scale3d(.3, .3, .3)'
            },
            {
                'opacity': 0,
                'transform': 'none',
                'transform-origin': 'center middle'
            }
        ],
        'timings': {
            'duration': 1000,
            'easing': 'elegantSlowStartEnd'
        },
        'name': 'zoomOut'
    };

    var zoomOutDown = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 1,
                'transform': 'none',
                'transform-origin': 'center bottom'
            },
            {
                'offset': 0.4,
                'opacity': 1,
                'transform': 'scale3d(.475, .475, .475) translate3d(0, -60px, 0)',
                'transform-origin': 'center bottom'
            },
            {
                'offset': 1,
                'opacity': 0,
                'transform': 'scale3d(.1, .1, .1) translate3d(0, 2000px, 0)',
                'transform-origin': 'center bottom'
            }
        ],
        'timings': {
            'duration': 1000,
            'easing': 'elegantSlowStartEnd'
        },
        'name': 'zoomOutDown'
    };

    var zoomOutLeft = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 1,
                'transform': 'none',
                'transform-origin': 'left center'
            },
            {
                'offset': 0.4,
                'opacity': 1,
                'transform': 'scale3d(.475, .475, .475) translate3d(42px, 0, 0)'
            },
            {
                'offset': 1,
                'opacity': 0,
                'transform': 'scale(.1) translate3d(-2000px, 0, 0)',
                'transform-origin': 'left center'
            }
        ],
        'timings': {
            'duration': 1000,
            'easing': 'elegantSlowStartEnd'
        },
        'name': 'zoomOutLeft'
    };

    var zoomOutRight = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 1,
                'transform': 'none',
                'transform-origin': 'right center'
            },
            {
                'offset': 0.4,
                'opacity': 1,
                'transform': 'scale3d(.475, .475, .475) translate3d(-42px, 0, 0)'
            },
            {
                'offset': 1,
                'opacity': 0,
                'transform': 'scale(.1) translate3d(2000px, 0, 0)',
                'transform-origin': 'right center'
            }
        ],
        'timings': {
            'duration': 1000,
            'easing': 'elegantSlowStartEnd'
        },
        'name': 'zoomOutRight'
    };

    var zoomOutUp = {
        'keyframes': [
            {
                'offset': 0,
                'opacity': 1,
                'transform': 'none',
                'transform-origin': 'center bottom'
            },
            {
                'offset': 0.4,
                'opacity': 1,
                'transform': 'scale3d(.475, .475, .475) translate3d(0, 60px, 0)'
            },
            {
                'offset': 1,
                'opacity': 0,
                'transform': 'scale3d(.1, .1, .1) translate3d(0, -2000px, 0)',
                'transform-origin': 'center bottom'
            }
        ],
        'timings': {
            'duration': 1000,
            'easing': 'elegantSlowStartEnd'
        },
        'name': 'zoomOutUp'
    };



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

    var animationManager = new AnimationManager();
    var allAnimations = Object.keys(animations).map(function (name) { return animations[name]; });
    animationManager.register(allAnimations);
    if (typeof angular !== 'undefined') {
        angular.module('just.animate', []).service('just', function () { return animationManager; });
    }
    window.Just = animationManager;

}());
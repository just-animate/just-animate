(function () {
    'use strict';

    var slice = Array.prototype.slice;
    function head(indexed) {
        return (!indexed || indexed.length < 1) ? undefined : indexed[0];
    }
    function toArray(indexed) {
        return slice.call(indexed, 0);
    }
    function each(items, fn) {
        for (var i = 0, len = items.length; i < len; i++) {
            fn(items[i]);
        }
    }
    function maxBy(items, predicate) {
        var max = '';
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var prop = predicate(item);
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

    var ostring = Object.prototype.toString;
    function isArray(a) {
        return !isString(a) && isNumber(a.length);
    }
    function isDefined(a) {
        return a !== undefined && a !== null && a !== '';
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

    var Dispatcher = (function () {
        function Dispatcher() {
            this._listeners = {};
        }
        Dispatcher.prototype.trigger = function (eventName, args) {
            var listeners = this._listeners[eventName];
            if (!listeners) {
                return;
            }
            var len = listeners.length;
            for (var i = 0; i < len; i++) {
                listeners[i].apply(undefined, args);
            }
        };
        Dispatcher.prototype.on = function (eventName, listener) {
            if (!isFunction(listener)) {
                throw 'invalid listener';
            }
            var listeners = this._listeners[eventName];
            if (!listeners) {
                this._listeners[eventName] = [listener];
                return;
            }
            if (listeners.indexOf(listener) !== -1) {
                return;
            }
            listeners.push(listener);
        };
        Dispatcher.prototype.off = function (eventName, listener) {
            var listeners = this._listeners[eventName];
            if (!listeners) {
                return false;
            }
            var indexOfListener = listeners.indexOf(listener);
            if (indexOfListener === -1) {
                return false;
            }
            listeners.splice(indexOfListener, 1);
            return true;
        };
        return Dispatcher;
    }());

    var animationPadding = 1.0 / 30;
    var TimelineAnimator = (function () {
        function TimelineAnimator(manager, options) {
            this._dispatcher = new Dispatcher();
            var duration = options.duration;
            if (duration === undefined) {
                throw 'Duration is required';
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
            this._dispatcher.trigger('finish');
        };
        TimelineAnimator.prototype._triggerCancel = function () {
            this._reset();
            each(this._events, function (evt) { return evt.animator.cancel(); });
            this._dispatcher.trigger('cancel');
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

    var now = (performance && performance.now) ? function () { return performance.now(); } : function () { return Date.now(); };
    var raf = (window && window.requestAnimationFrame) || (function (fn) { return setTimeout(fn, 16.66); });
    var TimeLoop = (function () {
        function TimeLoop() {
            this._isRunning = false;
            this._lastTime = undefined;
            this._callbacks = [];
            this._elapses = [];
            this._update = this._update.bind(this);
        }
        TimeLoop.prototype.subscribe = function (fn) {
            if (this._callbacks.indexOf(fn) !== -1) {
                return;
            }
            this._callbacks.push(fn);
            this._elapses.push(0);
            if (!this._isRunning) {
                this._isRunning = true;
                raf(this._update);
            }
        };
        TimeLoop.prototype.unsubscribe = function (fn) {
            var indexOfSub = this._callbacks.indexOf(fn);
            if (indexOfSub === -1) {
                return;
            }
            this._callbacks.splice(indexOfSub, 1);
            this._elapses.splice(indexOfSub, 1);
        };
        TimeLoop.prototype._update = function () {
            var callbacks = this._callbacks;
            var elapses = this._elapses;
            var len = callbacks.length;
            var lastTime = this._lastTime || now();
            var thisTime = now();
            var delta = thisTime - lastTime;
            if (!len) {
                this._isRunning = false;
                this._lastTime = undefined;
                return;
            }
            this._isRunning = true;
            this._lastTime = thisTime;
            raf(this._update);
            for (var i = 0; i < len; i++) {
                var existingElapsed = elapses[i];
                var updatedElapsed = existingElapsed + delta;
                elapses[i] = updatedElapsed;
                callbacks[i](delta, updatedElapsed);
            }
        };
        return TimeLoop;
    }());

    var call = 'call';
    var set = 'set';
    var finish = 'finish';
    var cancel = 'cancel';
    var play = 'play';
    var pause = 'pause';
    var reverse = 'reverse';
    var running = 'running';
    var pending = 'pending';
    var Animator = (function () {
        function Animator(effects, timeLoop) {
            var _this = this;
            effects = effects || [];
            var dispatcher = new Dispatcher();
            var firstEffect = head(effects);
            if (firstEffect) {
                firstEffect.addEventListener(finish, function () {
                    _this._dispatcher.trigger(finish);
                    _this._timeLoop.unsubscribe(_this._tick);
                });
            }
            each(effects, function (effect) {
                dispatcher.on(set, function (propName, propValue) { effect[propName] = propValue; });
                dispatcher.on(call, function (functionName) { effect[functionName](); });
            });
            this._duration = maxBy(effects, function (e) { return e.totalDuration; });
            this._tick = this._tick.bind(this);
            this._dispatcher = dispatcher;
            this._timeLoop = timeLoop;
            this._effects = effects;
        }
        Object.defineProperty(Animator.prototype, "currentTime", {
            get: function () {
                return this._currentTime;
            },
            set: function (value) {
                this._currentTime = value;
                this._dispatcher.trigger(set, ['currentTime', value]);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animator.prototype, "playbackRate", {
            get: function () {
                return this._playbackRate;
            },
            set: function (value) {
                this._playbackRate = value;
                this._dispatcher.trigger(set, ['playbackRate', value]);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animator.prototype, "playState", {
            get: function () {
                return this._playState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animator.prototype, "duration", {
            get: function () {
                return this._duration;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animator.prototype, "iterationStart", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animator.prototype, "iterations", {
            get: function () {
                return 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animator.prototype, "endTime", {
            get: function () {
                return this._duration;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animator.prototype, "startTime", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animator.prototype, "totalDuration", {
            get: function () {
                return this._duration;
            },
            enumerable: true,
            configurable: true
        });
        Animator.prototype.addEventListener = function (eventName, listener) {
            this._dispatcher.on(eventName, listener);
        };
        Animator.prototype.removeEventListener = function (eventName, listener) {
            this._dispatcher.off(eventName, listener);
        };
        Animator.prototype.cancel = function () {
            this._dispatcher.trigger(call, [cancel]);
            this.currentTime = 0;
            this._dispatcher.trigger(cancel);
        };
        Animator.prototype.finish = function () {
            this._dispatcher.trigger(call, [finish]);
            this.currentTime = this.playbackRate < 0 ? 0 : this.duration;
            this._dispatcher.trigger(finish);
        };
        Animator.prototype.play = function () {
            this._dispatcher.trigger(call, [play]);
            this._dispatcher.trigger(play);
            this._timeLoop.subscribe(this._tick);
        };
        Animator.prototype.pause = function () {
            this._dispatcher.trigger(call, [pause]);
            this._dispatcher.trigger(pause);
        };
        Animator.prototype.reverse = function () {
            this._dispatcher.trigger(call, [reverse]);
            this._dispatcher.trigger(reverse);
        };
        Animator.prototype._tick = function () {
            this._dispatcher.trigger('update', [this.currentTime]);
            var firstEffect = head(this._effects);
            this._currentTime = firstEffect.currentTime;
            this._playbackRate = firstEffect.playbackRate;
            this._playState = firstEffect.playState;
            if (this._playState === running || this._playState === pending) {
                this._timeLoop.subscribe(this._tick);
                return;
            }
            this._timeLoop.unsubscribe(this._tick);
        };
        return Animator;
    }());

    var easings = {
        easeInBack: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
        easeInCirc: 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
        easeInCubic: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
        easeInExpo: 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
        easeInOutBack: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
        easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
        easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
        easeInOutExpo: 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
        easeInOutQuad: 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
        easeInOutQuart: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
        easeInOutQuint: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
        easeInOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
        easeInQuad: 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
        easeInQuart: 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
        easeInQuint: 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
        easeInSine: 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
        easeOutBack: 'cubic-bezier(0.175,  0.885, 0.320, 1.275)',
        easeOutCirc: 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
        easeOutCubic: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
        easeOutExpo: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
        easeOutQuad: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        easeOutQuart: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
        easeOutQuint: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
        easeOutSine: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
        elegantSlowStartEnd: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'
    };

    function pipe(initial) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var value = isFunction(initial) ? initial() : initial;
        var len = arguments.length;
        for (var x = 1; x < len; x++) {
            value = arguments[x](value);
        }
        return value;
    }

    var camelCaseRegex = /([a-z])[- ]([a-z])/ig;
    function camelCaseReplacer(match, p1, p2) {
        return p1 + p2.toUpperCase();
    }
    function toCamelCase(value) {
        return isString(value) ? value.replace(camelCaseRegex, camelCaseReplacer) : undefined;
    }

    var offset = 'offset';
    function spaceKeyframes(keyframes) {
        if (keyframes.length < 2) {
            return keyframes;
        }
        var first = keyframes[0];
        if (first.offset !== 0) {
            first.offset = 0;
        }
        var last = keyframes[keyframes.length - 1];
        if (last.offset !== 1) {
            last.offset = 1;
        }
        var len = keyframes.length;
        var lasti = len - 1;
        for (var i = 1; i < lasti; i++) {
            var target = keyframes[i];
            if (isNumber(target.offset)) {
                continue;
            }
            for (var j = i + 1; j < len; j++) {
                if (!isNumber(keyframes[j].offset)) {
                    continue;
                }
                var startTime = keyframes[i - 1].offset;
                var endTime = keyframes[j].offset;
                var timeDelta = endTime - startTime;
                var deltaLength = j - i + 1;
                for (var k = 1; k < deltaLength; k++) {
                    keyframes[k - 1 + i].offset = ((k / j) * timeDelta) + startTime;
                }
                i = j;
                break;
            }
        }
        return keyframes;
    }
    function normalizeKeyframes(keyframes) {
        if (keyframes.length < 2) {
            return keyframes;
        }
        var first = keyframes[0];
        if (first.offset !== 0) {
            first.offset = 0;
        }
        var last = keyframes[keyframes.length - 1];
        var len = keyframes.length;
        for (var i = 1; i < len; i++) {
            var keyframe = keyframes[i];
            for (var prop in keyframe) {
                if (prop === offset || isDefined(first[prop])) {
                    continue;
                }
                first[prop] = keyframe[prop];
            }
        }
        for (var i = len - 2; i > -1; i--) {
            var keyframe = keyframes[i];
            for (var prop in keyframe) {
                if (prop === offset || isDefined(last[prop])) {
                    continue;
                }
                last[prop] = keyframe[prop];
            }
        }
        return keyframes;
    }
    function normalizeProperties(keyframe) {
        var x = 0;
        var y = 1;
        var z = 2;
        var scale = new Array(3);
        var skew = new Array(2);
        var translate = new Array(3);
        var output = {};
        var transform = '';
        for (var prop in keyframe) {
            var value = keyframe[prop];
            if (!isDefined(value)) {
                continue;
            }
            switch (prop) {
                case 'scale3d':
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 3) {
                            throw Error('scale3d requires x, y, & z');
                        }
                        scale[x] = arr[x];
                        scale[y] = arr[y];
                        scale[z] = arr[z];
                        continue;
                    }
                    if (isNumber(value)) {
                        scale[x] = value;
                        scale[y] = value;
                        scale[z] = value;
                        continue;
                    }
                    throw Error('scale3d requires a number or number[]');
                case 'scale':
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 2) {
                            throw Error('scale requires x & y');
                        }
                        scale[x] = arr[x];
                        scale[y] = arr[y];
                        continue;
                    }
                    if (isNumber(value)) {
                        scale[x] = value;
                        scale[y] = value;
                        continue;
                    }
                    throw Error('scale requires a number or number[]');
                case 'scaleX':
                    if (isNumber(value)) {
                        scale[x] = value;
                        continue;
                    }
                    throw Error('scaleX requires a number');
                case 'scaleY':
                    if (isNumber(value)) {
                        scale[y] = value;
                        continue;
                    }
                    throw Error('scaleY requires a number');
                case 'scaleZ':
                    if (isNumber(value)) {
                        scale[z] = value;
                        continue;
                    }
                    throw Error('scaleZ requires a number');
                case 'skew':
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 2) {
                            throw Error('skew requires x & y');
                        }
                        skew[x] = arr[x];
                        skew[y] = arr[y];
                        continue;
                    }
                    if (isNumber(value)) {
                        skew[x] = value;
                        skew[y] = value;
                        continue;
                    }
                    throw Error('skew requires a number, string, string[], or number[]');
                case 'skewX':
                    if (isString(value)) {
                        skew[x] = value;
                        continue;
                    }
                    throw Error('skewX requires a number or string');
                case 'skewY':
                    if (isString(value)) {
                        skew[y] = value;
                        continue;
                    }
                    throw Error('skewY requires a number or string');
                case 'rotate3d':
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 4) {
                            throw Error('rotate3d requires x, y, z, & a');
                        }
                        transform += " rotate3d(" + arr[0] + "," + arr[1] + "," + arr[2] + "," + arr[3] + ")";
                        continue;
                    }
                    throw Error('rotate3d requires an []');
                case 'rotateX':
                    if (isString(value)) {
                        transform += " rotate3d(1, 0, 0, " + value + ")";
                        continue;
                    }
                    throw Error('rotateX requires a string');
                case 'rotateY':
                    if (isString(value)) {
                        transform += " rotate3d(0, 1, 0, " + value + ")";
                        continue;
                    }
                    throw Error('rotateY requires a string');
                case 'rotate':
                case 'rotateZ':
                    if (isString(value)) {
                        transform += " rotate3d(0, 0, 1, " + value + ")";
                        continue;
                    }
                    throw Error('rotateZ requires a string');
                case 'translate3d':
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 3) {
                            throw Error('translate3d requires x, y, & z');
                        }
                        translate[x] = arr[x];
                        translate[y] = arr[y];
                        translate[z] = arr[z];
                        continue;
                    }
                    if (isString(value) || isNumber(value)) {
                        translate[x] = value;
                        translate[y] = value;
                        translate[z] = value;
                        continue;
                    }
                    throw Error('translate3d requires a number, string, string[], or number[]');
                case 'translate':
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 2) {
                            throw Error('translate requires x & y');
                        }
                        translate[x] = arr[x];
                        translate[y] = arr[y];
                        continue;
                    }
                    if (isString(value) || isNumber(value)) {
                        translate[x] = value;
                        translate[y] = value;
                        continue;
                    }
                    throw Error('translate requires a number, string, string[], or number[]');
                case 'x':
                case 'translateX':
                    if (isString(value) || isNumber(value)) {
                        translate[x] = value;
                        continue;
                    }
                    throw Error('translateX requires a number or string');
                case 'y':
                case 'translateY':
                    if (isString(value) || isNumber(value)) {
                        translate[y] = value;
                        continue;
                    }
                    throw Error('translateY requires a number or string');
                case 'z':
                case 'translateZ':
                    if (isString(value) || isNumber(value)) {
                        translate[z] = value;
                        continue;
                    }
                    throw Error('translateZ requires a number or string');
                case 'transform':
                    transform += ' ' + value;
                    break;
                default:
                    var prop2 = toCamelCase(prop);
                    output[prop2] = value;
                    break;
            }
        }
        var isScaleX = scale[x] !== undefined;
        var isScaleY = scale[y] !== undefined;
        var isScaleZ = scale[z] !== undefined;
        if (isScaleX && isScaleZ || isScaleY && isScaleZ) {
            var scaleString = scale.map(function (s) { return s || '1'; }).join(',');
            transform += " scale3d(" + scaleString + ")";
        }
        else if (isScaleX && isScaleY) {
            transform += " scale(" + (scale[x] || 1) + ", " + (scale[y] || 1) + ")";
        }
        else if (isScaleX) {
            transform += " scaleX(" + scale[x] + ")";
        }
        else if (isScaleY) {
            transform += " scaleX(" + scale[y] + ")";
        }
        else if (isScaleZ) {
            transform += " scaleX(" + scale[z] + ")";
        }
        else {
        }
        var isskewX = skew[x] !== undefined;
        var isskewY = skew[y] !== undefined;
        if (isskewX && isskewY) {
            transform += " skew(" + (skew[x] || 1) + ", " + (skew[y] || 1) + ")";
        }
        else if (isskewX) {
            transform += " skewX(" + skew[x] + ")";
        }
        else if (isskewY) {
            transform += " skewY(" + skew[y] + ")";
        }
        else {
        }
        var istranslateX = translate[x] !== undefined;
        var istranslateY = translate[y] !== undefined;
        var istranslateZ = translate[z] !== undefined;
        if (istranslateX && istranslateZ || istranslateY && istranslateZ) {
            var translateString = translate.map(function (s) { return s || '1'; }).join(',');
            transform += " translate3d(" + translateString + ")";
        }
        else if (istranslateX && istranslateY) {
            transform += " translate(" + (translate[x] || 1) + ", " + (translate[y] || 1) + ")";
        }
        else if (istranslateX) {
            transform += " translateX(" + translate[x] + ")";
        }
        else if (istranslateY) {
            transform += " translateY(" + translate[y] + ")";
        }
        else if (istranslateZ) {
            transform += " translateZ(" + translate[z] + ")";
        }
        else {
        }
        if (transform) {
            output['transform'] = transform;
        }
        return output;
    }

    function queryElements(source) {
        if (!source) {
            throw 'no elements';
        }
        if (isString(source)) {
            var nodeResults = document.querySelectorAll(source);
            return toArray(nodeResults);
        }
        if (typeof source['tagName'] === 'string') {
            return [source];
        }
        if (isFunction(source)) {
            var provider = source;
            var result = provider();
            return queryElements(result);
        }
        if (isArray(source)) {
            var elements_1 = [];
            each(source, function (i) {
                var innerElements = queryElements(i);
                elements_1.push.apply(elements_1, innerElements);
            });
            return elements_1;
        }
        return [];
    }

    var KeyframeAnimation = (function () {
        function KeyframeAnimation(target, keyframes, timings) {
            var dispatcher = new Dispatcher();
            var animator = target['animate'](keyframes, timings);
            animator.pause();
            animator['onfinish'] = function () { return dispatcher.trigger('finish'); };
            this._iterationStart = timings.iterationStart || 0;
            this._iterations = timings.iterations || 1;
            this._duration = timings.duration;
            this._startTime = timings.delay || 0;
            this._endTime = (timings.endDelay || 0) + timings.duration;
            this._totalDuration = (timings.delay || 0) + ((timings.iterations || 1) * timings.duration) + (timings.endDelay || 0);
            this._dispatcher = dispatcher;
            this._animator = animator;
        }
        Object.defineProperty(KeyframeAnimation.prototype, "currentTime", {
            get: function () {
                return this._animator.currentTime;
            },
            set: function (value) {
                this._animator.currentTime = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyframeAnimation.prototype, "playbackRate", {
            get: function () {
                return this._animator.playbackRate;
            },
            set: function (value) {
                this._animator.playbackRate = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyframeAnimation.prototype, "playState", {
            get: function () {
                return this._animator.playState;
            },
            set: function (value) {
                this._animator.playState = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyframeAnimation.prototype, "iterationStart", {
            get: function () {
                return this._iterationStart;
            },
            set: function (value) {
                this._iterationStart = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyframeAnimation.prototype, "iterations", {
            get: function () {
                return this._iterations;
            },
            set: function (value) {
                this._iterations = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyframeAnimation.prototype, "totalDuration", {
            get: function () {
                return this._totalDuration;
            },
            set: function (value) {
                this._totalDuration = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyframeAnimation.prototype, "duration", {
            get: function () {
                return this._duration;
            },
            set: function (value) {
                this._duration = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyframeAnimation.prototype, "endTime", {
            get: function () {
                return this._endTime;
            },
            set: function (value) {
                this._endTime = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyframeAnimation.prototype, "startTime", {
            get: function () {
                return this._startTime;
            },
            set: function (value) {
                this._startTime = value;
            },
            enumerable: true,
            configurable: true
        });
        KeyframeAnimation.prototype.removeEventListener = function (eventName, listener) {
            this._dispatcher.off(eventName, listener);
        };
        KeyframeAnimation.prototype.addEventListener = function (eventName, listener) {
            this._dispatcher.on(eventName, listener);
        };
        KeyframeAnimation.prototype.cancel = function () {
            this._animator.cancel();
            this._dispatcher.trigger('cancel');
        };
        KeyframeAnimation.prototype.reverse = function () {
            this._animator.reverse();
            this._dispatcher.trigger('reverse');
        };
        KeyframeAnimation.prototype.pause = function () {
            this._animator.pause();
            this._dispatcher.trigger('pause');
        };
        KeyframeAnimation.prototype.play = function () {
            this._animator.play();
            this._dispatcher.trigger('play');
        };
        KeyframeAnimation.prototype.finish = function () {
            this._animator.finish();
        };
        return KeyframeAnimation;
    }());

    var JustAnimate = (function () {
        function JustAnimate() {
            this._registry = {};
            this._timeLoop = new TimeLoop();
        }
        JustAnimate.inject = function (animations) {
            each(animations, function (a) { return JustAnimate._globalAnimations[a.name] = a; });
        };
        JustAnimate.prototype.animate = function (keyframesOrName, targets, timings) {
            var a = this._resolveArguments(keyframesOrName, timings);
            var elements = queryElements(targets);
            var effects = map(elements, function (e) { return new KeyframeAnimation(e, a.keyframes, a.timings); });
            var animator = new Animator(effects, this._timeLoop);
            animator.play();
            return animator;
        };
        JustAnimate.prototype.animateSequence = function (options) {
            var _this = this;
            var offset = 0;
            var effectOptions = map(options.steps, function (step) {
                var a = _this._resolveArguments(step.name || step.keyframes, step.timings);
                var startDelay = a.timings.delay || 0;
                var endDelay = a.timings.endDelay || 0;
                var duration = a.timings.duration || 0;
                a.timings.delay = offset + startDelay;
                a.targets = step.el;
                offset += startDelay + duration + endDelay;
                return a;
            });
            each(effectOptions, function (e) {
                e.timings.endDelay = offset - ((e.timings.delay || 0) + e.timings.duration + (e.timings.endDelay || 0));
            });
            var effects = [];
            each(effectOptions, function (a) {
                var elements = queryElements(a.targets);
                var animations = map(elements, function (e) { return new KeyframeAnimation(e, a.keyframes, a.timings); });
                if (animations.length === 1) {
                    effects.push(animations[0]);
                }
                else if (animations.length > 1) {
                    effects.push(new Animator(animations, _this._timeLoop));
                }
            });
            var animator = new Animator(effects, this._timeLoop);
            if (options.autoplay) {
                animator.play();
            }
            return animator;
        };
        JustAnimate.prototype.animateTimeline = function (options) {
            return new TimelineAnimator(this, options);
        };
        JustAnimate.prototype.findAnimation = function (name) {
            return this._registry[name] || JustAnimate._globalAnimations[name] || undefined;
        };
        JustAnimate.prototype.register = function (animationOptions) {
            this._registry[animationOptions.name] = animationOptions;
        };
        JustAnimate.prototype.inject = function (animations) {
            JustAnimate.inject(animations);
        };
        JustAnimate.prototype._resolveArguments = function (keyframesOrName, timings) {
            var keyframes;
            if (isString(keyframesOrName)) {
                var definition = this.findAnimation(keyframesOrName);
                keyframes = pipe(map(definition.keyframes, normalizeProperties), spaceKeyframes, normalizeKeyframes);
                timings = extend({}, definition.timings, timings);
            }
            else {
                keyframes = pipe(map(keyframesOrName, normalizeProperties), spaceKeyframes, normalizeKeyframes);
            }
            if (timings && timings.easing) {
                var easing = easings[timings.easing];
                if (easing) {
                    timings.easing = easing;
                }
            }
            return {
                keyframes: keyframes,
                timings: timings
            };
        };
        JustAnimate._globalAnimations = {};
        return JustAnimate;
    }());

    if (typeof angular !== 'undefined') {
        angular.module('just.animate', []).service('just', JustAnimate);
    }
    window.just = new JustAnimate();

}());
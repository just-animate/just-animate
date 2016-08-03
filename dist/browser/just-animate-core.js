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

    var dispatcher = {
        _fn: undefined,
        trigger: function (eventName, args) {
            var listeners = this._fn[eventName];
            if (!listeners) {
                return;
            }
            var len = listeners.length;
            for (var i = 0; i < len; i++) {
                listeners[i].apply(undefined, args);
            }
        },
        on: function (eventName, listener) {
            if (!isFunction(listener)) {
                throw 'invalid listener';
            }
            var listeners = this._fn[eventName];
            if (!listeners) {
                this._fn[eventName] = [listener];
                return;
            }
            if (listeners.indexOf(listener) !== -1) {
                return;
            }
            listeners.push(listener);
        },
        off: function (eventName, listener) {
            var listeners = this._fn[eventName];
            if (!listeners) {
                return false;
            }
            var indexOfListener = listeners.indexOf(listener);
            if (indexOfListener === -1) {
                return false;
            }
            listeners.splice(indexOfListener, 1);
            return true;
        }
    };
    function createDispatcher() {
        var self = Object.create(dispatcher);
        self._fn = {};
        return self;
    }

    var KeyframeAnimation = (function () {
        function KeyframeAnimation(target, keyframes, timings) {
            var self = this;
            var dispatcher = createDispatcher();
            var animator = target['animate'](keyframes, timings);
            animator.pause();
            animator['onfinish'] = function () { return dispatcher.trigger('finish'); };
            self._iterationStart = timings.iterationStart || 0;
            self._iterations = timings.iterations || 1;
            self._duration = timings.duration;
            self._startTime = timings.delay || 0;
            self._endTime = (timings.endDelay || 0) + timings.duration;
            self._totalDuration = (timings.delay || 0) + ((timings.iterations || 1) * timings.duration) + (timings.endDelay || 0);
            self._dispatcher = dispatcher;
            self._animator = animator;
        }
        KeyframeAnimation.prototype.currentTime = function (value) {
            var self = this;
            if (!isDefined(value)) {
                return self._animator.currentTime;
            }
            self._animator.currentTime = value;
            return self;
        };
        KeyframeAnimation.prototype.playbackRate = function (value) {
            var self = this;
            if (!isDefined(value)) {
                return self._animator.playbackRate;
            }
            self._animator.playbackRate = value;
            return self;
        };
        KeyframeAnimation.prototype.playState = function () {
            return this._animator.playState;
        };
        KeyframeAnimation.prototype.iterationStart = function () {
            return this._iterationStart;
        };
        KeyframeAnimation.prototype.iterations = function () {
            return this._iterations;
        };
        KeyframeAnimation.prototype.totalDuration = function () {
            return this._totalDuration;
        };
        KeyframeAnimation.prototype.duration = function () {
            return this._duration;
        };
        KeyframeAnimation.prototype.endTime = function () {
            return this._endTime;
        };
        KeyframeAnimation.prototype.startTime = function () {
            return this._startTime;
        };
        KeyframeAnimation.prototype.off = function (eventName, listener) {
            this._dispatcher.off(eventName, listener);
            return this;
        };
        KeyframeAnimation.prototype.on = function (eventName, listener) {
            this._dispatcher.on(eventName, listener);
            return this;
        };
        KeyframeAnimation.prototype.cancel = function () {
            var self = this;
            self._animator.cancel();
            self._dispatcher.trigger('cancel');
            return self;
        };
        KeyframeAnimation.prototype.reverse = function () {
            var self = this;
            self._animator.reverse();
            self._dispatcher.trigger('reverse');
            return self;
        };
        KeyframeAnimation.prototype.pause = function () {
            var self = this;
            self._animator.pause();
            self._dispatcher.trigger('pause');
            return self;
        };
        KeyframeAnimation.prototype.play = function () {
            var self = this;
            self._animator.play();
            self._dispatcher.trigger('play');
            return self;
        };
        KeyframeAnimation.prototype.finish = function () {
            var self = this;
            self._animator.finish();
            return self;
        };
        return KeyframeAnimation;
    }());

    var call = 'call';
    var finish = 'finish';
    var cancel = 'cancel';
    var play = 'play';
    var pause = 'pause';
    var reverse = 'reverse';
    var running = 'running';
    var pending = 'pending';
    var Animator = (function () {
        function Animator(effects, timeLoop) {
            var self = this;
            effects = effects || [];
            var dispatcher = createDispatcher();
            var firstEffect = head(effects);
            if (firstEffect) {
                firstEffect.on(finish, function () {
                    self._dispatcher.trigger(finish);
                    self._timeLoop.off(self._tick);
                });
            }
            each(effects, function (effect) {
                dispatcher.on(call, function (functionName, arg1) { effect[functionName](arg1); });
            });
            self._duration = maxBy(effects, function (e) { return e.totalDuration(); });
            self._tick = self._tick.bind(self);
            self._dispatcher = dispatcher;
            self._timeLoop = timeLoop;
            self._effects = effects;
        }
        Animator.prototype.currentTime = function (value) {
            var self = this;
            if (!isDefined(value)) {
                return self._currentTime;
            }
            self._currentTime = value;
            self._dispatcher.trigger(call, ['currentTime', value]);
            return self;
        };
        Animator.prototype.playbackRate = function (value) {
            var self = this;
            if (!isDefined(value)) {
                return self._currentTime;
            }
            self._playbackRate = value;
            self._dispatcher.trigger(call, ['playbackRate', value]);
            return self;
        };
        Animator.prototype.playState = function () {
            return this._playState;
        };
        Animator.prototype.duration = function () {
            return this._duration;
        };
        Animator.prototype.iterationStart = function () {
            return 0;
        };
        Animator.prototype.iterations = function () {
            return 1;
        };
        Animator.prototype.endTime = function () {
            return this._duration;
        };
        Animator.prototype.startTime = function () {
            return 0;
        };
        Animator.prototype.totalDuration = function () {
            return this._duration;
        };
        Animator.prototype.on = function (eventName, listener) {
            this._dispatcher.on(eventName, listener);
            return this;
        };
        Animator.prototype.off = function (eventName, listener) {
            this._dispatcher.off(eventName, listener);
            return this;
        };
        Animator.prototype.cancel = function () {
            var self = this;
            self._dispatcher.trigger(call, [cancel]);
            self.currentTime(0);
            self._dispatcher.trigger(cancel);
            return self;
        };
        Animator.prototype.finish = function () {
            var self = this;
            self._dispatcher.trigger(call, [finish]);
            self.currentTime(self._playbackRate < 0 ? 0 : self._duration);
            self._dispatcher.trigger(finish);
            return self;
        };
        Animator.prototype.play = function () {
            var self = this;
            self._dispatcher.trigger(call, [play]);
            self._dispatcher.trigger(play);
            self._timeLoop.on(self._tick);
            return self;
        };
        Animator.prototype.pause = function () {
            var self = this;
            self._dispatcher.trigger(call, [pause]);
            self._dispatcher.trigger(pause);
            return self;
        };
        Animator.prototype.reverse = function () {
            var self = this;
            self._dispatcher.trigger(call, [reverse]);
            self._dispatcher.trigger(reverse);
            return self;
        };
        Animator.prototype._tick = function () {
            var self = this;
            var firstEffect = head(self._effects);
            self._dispatcher.trigger('update', [self.currentTime]);
            self._currentTime = firstEffect.currentTime();
            self._playbackRate = firstEffect.playbackRate();
            self._playState = firstEffect.playState();
            if (self._playState !== running && self._playState !== pending) {
                self._timeLoop.off(self._tick);
            }
        };
        return Animator;
    }());

    var animationPadding = 1.0 / 30;
    var TimelineAnimator = (function () {
        function TimelineAnimator(options, timeloop) {
            var duration = options.duration;
            if (duration === undefined) {
                throw 'Duration is required';
            }
            this._timeLoop = timeloop;
            this._dispatcher = createDispatcher();
            this._playbackRate = 0;
            this._duration = options.duration;
            this._currentTime = 0;
            this._events = map(options.events, function (evt) { return new TimelineEvent(timeloop, duration, evt); });
            this._isPaused = false;
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
            if (!isDefined(value)) {
                return this._currentTime;
            }
            this._currentTime = value;
            return this;
        };
        TimelineAnimator.prototype.playbackRate = function (value) {
            if (!isDefined(value)) {
                return this._playbackRate;
            }
            this._playbackRate = value;
            return this;
        };
        TimelineAnimator.prototype.playState = function (value) {
            if (!isDefined(value)) {
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
                var delta = (thisTick - lastTick) * this._playbackRate;
                this._currentTime += delta;
            }
            this._lastTick = thisTick;
            if (this._currentTime > this._duration || this._currentTime < 0) {
                this._triggerFinish();
                return;
            }
            each(this._events, function (evt) {
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
            each(this._events, function (evt) { return evt.animator().finish(); });
            this._dispatcher.trigger('finish');
        };
        TimelineAnimator.prototype._triggerCancel = function () {
            this._reset();
            each(this._events, function (evt) { return evt.animator().cancel(); });
            this._dispatcher.trigger('cancel');
        };
        TimelineAnimator.prototype._triggerPause = function () {
            this._isPaused = true;
            this._isInEffect = false;
            this._lastTick = undefined;
            this._playbackRate = 0;
            each(this._events, function (evt) {
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
            each(this._events, function (evt) {
                evt.isInEffect = false;
            });
        };
        return TimelineAnimator;
    }());
    var TimelineEvent = (function () {
        function TimelineEvent(timeloop, timelineDuration, evt) {
            var keyframes = evt.keyframes;
            var timings = evt.timings;
            var el = evt.el;
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
            this._timeLoop = timeloop;
        }
        TimelineEvent.prototype.animator = function () {
            var _this = this;
            if (!this._animator) {
                var elements = queryElements(this.el);
                var effects = map(elements, function (e) { return new KeyframeAnimation(e, _this.keyframes, _this.timings); });
                this._animator = new Animator(effects, this._timeLoop);
                this._animator.pause();
            }
            return this._animator;
        };
        return TimelineEvent;
    }());

    var now = (performance && performance.now) ? function () { return performance.now(); } : function () { return Date.now(); };
    var raf = (window.requestAnimationFrame !== undefined)
        ? function (ctx, fn) {
            window.requestAnimationFrame(function () { fn(ctx); });
        }
        : function (ctx, fn) {
            setTimeout(function () { fn(ctx); }, 16.66);
        };
    function createLoop() {
        var ctx = {
            active: [],
            elapses: [],
            isActive: false,
            lastTime: undefined,
            offs: [],
            ons: []
        };
        return {
            off: function (fn) { return off(ctx, fn); },
            on: function (fn) { return on(ctx, fn); }
        };
    }
    function on(self, fn) {
        var offIndex = self.offs.indexOf(fn);
        if (offIndex !== -1) {
            self.offs.splice(offIndex, 1);
        }
        if (self.ons.indexOf(fn) === -1) {
            self.ons.push(fn);
        }
        if (!self.isActive) {
            self.isActive = true;
            raf(self, update);
        }
    }
    function off(self, fn) {
        var onIndex = self.ons.indexOf(fn);
        if (onIndex !== -1) {
            self.ons.splice(onIndex, 1);
        }
        if (self.offs.indexOf(fn) === -1) {
            self.offs.push(fn);
        }
        if (!self.isActive) {
            self.isActive = true;
            raf(self, update);
        }
    }
    function update(self) {
        updateOffs(self);
        updateOns(self);
        var callbacks = self.active;
        var elapses = self.elapses;
        var len = callbacks.length;
        var lastTime = self.lastTime || now();
        var thisTime = now();
        var delta = thisTime - lastTime;
        if (!len) {
            self.isActive = false;
            self.lastTime = undefined;
            return;
        }
        self.isActive = true;
        self.lastTime = thisTime;
        raf(self, update);
        for (var i = 0; i < len; i++) {
            var existingElapsed = elapses[i];
            var updatedElapsed = existingElapsed + delta;
            elapses[i] = updatedElapsed;
            callbacks[i](delta, updatedElapsed);
        }
    }
    function updateOffs(self) {
        var len = self.offs.length;
        for (var i = 0; i < len; i++) {
            var fn = self.offs[i];
            var indexOfSub = self.active.indexOf(fn);
            if (indexOfSub !== -1) {
                self.active.splice(indexOfSub, 1);
                self.elapses.splice(indexOfSub, 1);
            }
        }
    }
    function updateOns(self) {
        var len = self.ons.length;
        for (var i = 0; i < len; i++) {
            var fn = self.ons[i];
            if (self.active.indexOf(fn) === -1) {
                self.active.push(fn);
                self.elapses.push(0);
            }
        }
    }

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

    var JustAnimate = (function () {
        function JustAnimate() {
            this._registry = {};
            this._timeLoop = createLoop();
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
            var _this = this;
            options.events.forEach(function (e) {
                var a = _this._resolveArguments(e.name || e.keyframes, e.timings);
                e.keyframes = a.keyframes;
                e.timings = a.timings;
            });
            return new TimelineAnimator(options, this._timeLoop);
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
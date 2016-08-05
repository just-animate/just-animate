(function () {
    'use strict';

    var slice = Array.prototype.slice;
    function head(indexed) {
        return (!indexed || indexed.length < 1) ? undefined : indexed[0];
    }
    function toArray(indexed, index) {
        return slice.call(indexed, index || 0);
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

    function invalidArg(name) {
        return new Error("Bad: " + name);
    }

    function queryElements(source) {
        if (!source) {
            throw invalidArg('source');
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
                throw invalidArg('listener');
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

    var animate = 'animate';
    var call = 'call';
    var cancel = 'cancel';
    var cubicBezier = 'cubic-bezier';
    var duration = 'duration';
    var finish = 'finish';
    var pause = 'pause';
    var pending = 'pending';
    var play = 'play';
    var reverse = 'reverse';
    var rotate = 'rotate';
    var rotate3d = 'rotate3d';
    var rotateX = 'rotateX';
    var rotateY = 'rotateY';
    var rotateZ = 'rotateZ';
    var running = 'running';
    var scale = 'scale';
    var scale3d = 'scale3d';
    var scaleX = 'scaleX';
    var scaleY = 'scaleY';
    var scaleZ = 'scaleZ';
    var skew = 'skew';
    var skewX = 'skewX';
    var skewY = 'skewY';
    var transform = 'transform';
    var translate = 'translate';
    var translate3d = 'translate3d';
    var translateX = 'translateX';
    var translateY = 'translateY';
    var translateZ = 'translateZ';
    var x = 'x';
    var y = 'y';
    var z = 'z';

    var keyframeAnimationPrototype = {
        _dispatcher: undefined,
        _duration: undefined,
        _endTime: undefined,
        _iterationStart: undefined,
        _iterations: undefined,
        _startTime: undefined,
        _totalDuration: undefined,
        currentTime: function (value) {
            var self = this;
            if (!isDefined(value)) {
                return self._animator.currentTime;
            }
            self._animator.currentTime = value;
            return self;
        },
        playbackRate: function (value) {
            var self = this;
            if (!isDefined(value)) {
                return self._animator.playbackRate;
            }
            self._animator.playbackRate = value;
            return self;
        },
        playState: function () {
            return this._animator.playState;
        },
        iterationStart: function () {
            return this._iterationStart;
        },
        iterations: function () {
            return this._iterations;
        },
        totalDuration: function () {
            return this._totalDuration;
        },
        duration: function () {
            return this._duration;
        },
        endTime: function () {
            return this._endTime;
        },
        startTime: function () {
            return this._startTime;
        },
        off: function (eventName, listener) {
            this._dispatcher.off(eventName, listener);
            return this;
        },
        on: function (eventName, listener) {
            this._dispatcher.on(eventName, listener);
            return this;
        },
        cancel: function () {
            var self = this;
            self._animator.cancel();
            self._dispatcher.trigger(cancel);
            return self;
        },
        reverse: function () {
            var self = this;
            self._animator.reverse();
            self._dispatcher.trigger(reverse);
            return self;
        },
        pause: function () {
            var self = this;
            self._animator.pause();
            self._dispatcher.trigger(pause);
            return self;
        },
        play: function () {
            var self = this;
            self._animator.play();
            self._dispatcher.trigger(play);
            return self;
        },
        finish: function () {
            var self = this;
            self._animator.finish();
            return self;
        }
    };
    function createKeyframeAnimation(target, keyframes, timings) {
        var self = Object.create(keyframeAnimationPrototype);
        var dispatcher = createDispatcher();
        var animator = target[animate](keyframes, timings);
        animator.pause();
        animator['onfinish'] = function () { return dispatcher.trigger(finish); };
        self._iterationStart = timings.iterationStart || 0;
        self._iterations = timings.iterations || 1;
        self._duration = timings.duration;
        self._startTime = timings.delay || 0;
        self._endTime = (timings.endDelay || 0) + timings.duration;
        self._totalDuration = (timings.delay || 0) + ((timings.iterations || 1) * timings.duration) + (timings.endDelay || 0);
        self._dispatcher = dispatcher;
        self._animator = animator;
        return self;
    }

    var multiAnimatorProtoType = {
        currentTime: function (value) {
            var self = this;
            if (!isDefined(value)) {
                return self._currentTime;
            }
            self._currentTime = value;
            self._dispatcher.trigger(call, ['currentTime', value]);
            return self;
        },
        playbackRate: function (value) {
            var self = this;
            if (!isDefined(value)) {
                return self._currentTime;
            }
            self._playbackRate = value;
            self._dispatcher.trigger(call, ['playbackRate', value]);
            return self;
        },
        playState: function () {
            return this._playState;
        },
        duration: function () {
            return this._duration;
        },
        iterationStart: function () {
            return 0;
        },
        iterations: function () {
            return 1;
        },
        endTime: function () {
            return this._duration;
        },
        startTime: function () {
            return 0;
        },
        totalDuration: function () {
            return this._duration;
        },
        on: function (eventName, listener) {
            this._dispatcher.on(eventName, listener);
            return this;
        },
        off: function (eventName, listener) {
            this._dispatcher.off(eventName, listener);
            return this;
        },
        cancel: function () {
            var self = this;
            self._dispatcher.trigger(call, [cancel]);
            self.currentTime(0);
            self._dispatcher.trigger(cancel);
            return self;
        },
        finish: function () {
            var self = this;
            self._dispatcher.trigger(call, [finish]);
            self.currentTime(self._playbackRate < 0 ? 0 : self._duration);
            self._dispatcher.trigger(finish);
            return self;
        },
        play: function () {
            var self = this;
            self._dispatcher.trigger(call, [play]);
            self._dispatcher.trigger(play);
            self._timeLoop.on(self._tick);
            return self;
        },
        pause: function () {
            var self = this;
            self._dispatcher.trigger(call, [pause]);
            self._dispatcher.trigger(pause);
            return self;
        },
        reverse: function () {
            var self = this;
            self._dispatcher.trigger(call, [reverse]);
            self._dispatcher.trigger(reverse);
            return self;
        },
        _tick: function () {
            var self = this;
            var firstEffect = head(self._effects);
            self._dispatcher.trigger('update', [self.currentTime]);
            self._currentTime = firstEffect.currentTime();
            self._playbackRate = firstEffect.playbackRate();
            self._playState = firstEffect.playState();
            if (self._playState !== running && self._playState !== pending) {
                self._timeLoop.off(self._tick);
            }
        }
    };
    function createMultiAnimator(effects, timeLoop) {
        var self = Object.create(multiAnimatorProtoType);
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
        return self;
    }

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
            if (!isDefined(value)) {
                return this._.currentTime;
            }
            this._.currentTime = value;
            return this;
        },
        playbackRate: function (value) {
            if (!isDefined(value)) {
                return this._.playbackRate;
            }
            this._.playbackRate = value;
            return this;
        },
        playState: function (value) {
            if (!isDefined(value)) {
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
        if (!isDefined(duration)) {
            throw invalidArg(duration);
        }
        self._ = {
            currentTime: 0,
            dispatcher: createDispatcher(),
            duration: options.duration,
            endTime: undefined,
            events: map(options.events, function (evt) { return createEvent(timeloop, duration1, evt); }),
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
    function tick(self) {
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
        var thisTick = performance.now();
        var lastTick = self.lastTick;
        if (lastTick !== undefined) {
            var delta = (thisTick - lastTick) * self.playbackRate;
            self.currentTime += delta;
        }
        self.lastTick = thisTick;
        if (self.currentTime > self.duration || self.currentTime < 0) {
            triggerFinish(self);
            return;
        }
        var playbackRate = self.playbackRate;
        each(self.events, function (evt) {
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
        each(self.events, function (evt) { return evt.animator().finish(); });
        self.dispatcher.trigger(finish);
    }
    function triggerCancel(self) {
        reset(self);
        each(self.events, function (evt) { return evt.animator().cancel(); });
        self.dispatcher.trigger(cancel);
    }
    function triggerPause(self) {
        self.isPaused = true;
        self.isInEffect = false;
        self.lastTick = undefined;
        self.playbackRate = 0;
        each(self.events, function (evt) {
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
        var startTime = timelineDuration * evt.offset;
        var endTime = startTime + timings.duration;
        var isClipped = endTime > timelineDuration;
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
            var elements = queryElements(this.el);
            var effects = map(elements, function (e) { return createKeyframeAnimation(e, _this.keyframes, _this.timings); });
            this._animator = createMultiAnimator(effects, this._timeLoop);
            this._animator.pause();
        }
        return this._animator;
    }

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

    var camelCaseRegex = /([a-z])[- ]([a-z])/ig;
    function camelCaseReplacer(match, p1, p2) {
        return p1 + p2.toUpperCase();
    }
    function toCamelCase(value) {
        return isString(value) ? value.replace(camelCaseRegex, camelCaseReplacer) : undefined;
    }
    var cssFunction = function () {
        var args = arguments;
        return args[0] + "(" + toArray(args, 1).join(',') + ")";
    };

    var easings = {
        easeInBack: cssFunction(cubicBezier, 0.6, -0.28, 0.735, 0.045),
        easeInCirc: cssFunction(cubicBezier, 0.6, 0.04, 0.98, 0.335),
        easeInCubic: cssFunction(cubicBezier, 0.55, 0.055, 0.675, 0.19),
        easeInExpo: cssFunction(cubicBezier, 0.95, 0.05, 0.795, 0.035),
        easeInOutBack: cssFunction(cubicBezier, 0.68, -0.55, 0.265, 1.55),
        easeInOutCirc: cssFunction(cubicBezier, 0.785, 0.135, 0.15, 0.86),
        easeInOutCubic: cssFunction(cubicBezier, 0.645, 0.045, 0.355, 1),
        easeInOutExpo: cssFunction(cubicBezier, 1, 0, 0, 1),
        easeInOutQuad: cssFunction(cubicBezier, 0.455, 0.03, 0.515, 0.955),
        easeInOutQuart: cssFunction(cubicBezier, 0.77, 0, 0.175, 1),
        easeInOutQuint: cssFunction(cubicBezier, 0.86, 0, 0.07, 1),
        easeInOutSine: cssFunction(cubicBezier, 0.445, 0.05, 0.55, 0.95),
        easeInQuad: cssFunction(cubicBezier, 0.55, 0.085, 0.68, 0.53),
        easeInQuart: cssFunction(cubicBezier, 0.895, 0.03, 0.685, 0.22),
        easeInQuint: cssFunction(cubicBezier, 0.755, 0.05, 0.855, 0.06),
        easeInSine: cssFunction(cubicBezier, 0.47, 0, 0.745, 0.715),
        easeOutBack: cssFunction(cubicBezier, 0.175, 0.885, 0.32, 1.275),
        easeOutCirc: cssFunction(cubicBezier, 0.075, 0.82, 0.165, 1),
        easeOutCubic: cssFunction(cubicBezier, 0.215, 0.61, 0.355, 1),
        easeOutExpo: cssFunction(cubicBezier, 0.19, 1, 0.22, 1),
        easeOutQuad: cssFunction(cubicBezier, 0.25, 0.46, 0.45, 0.94),
        easeOutQuart: cssFunction(cubicBezier, 0.165, 0.84, 0.44, 1),
        easeOutQuint: cssFunction(cubicBezier, 0.23, 1, 0.32, 1),
        easeOutSine: cssFunction(cubicBezier, 0.39, 0.575, 0.565, 1),
        elegantSlowStartEnd: cssFunction(cubicBezier, 0.175, 0.885, 0.32, 1.275)
    };

    var pipe = function pipe() {
        var args = arguments;
        var initial = args[0];
        var value = isFunction(initial) ? initial() : initial;
        var len = args.length;
        for (var x = 1; x < len; x++) {
            value = args[x](value);
        }
        return value;
    };

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
        var xIndex = 0;
        var yIndex = 1;
        var zIndex = 2;
        var scaleArray = [];
        var skewArray = [];
        var translateArray = [];
        var output = {};
        var transformString = '';
        for (var prop in keyframe) {
            var value = keyframe[prop];
            if (!isDefined(value)) {
                continue;
            }
            switch (prop) {
                case scale3d:
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 3) {
                            throw invalidArg(scale3d);
                        }
                        scaleArray[xIndex] = arr[xIndex];
                        scaleArray[yIndex] = arr[yIndex];
                        scaleArray[zIndex] = arr[zIndex];
                        continue;
                    }
                    if (isNumber(value)) {
                        scaleArray[xIndex] = value;
                        scaleArray[yIndex] = value;
                        scaleArray[zIndex] = value;
                        continue;
                    }
                    throw invalidArg(scale3d);
                case scale:
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 2) {
                            throw invalidArg(scale);
                        }
                        scaleArray[xIndex] = arr[xIndex];
                        scaleArray[yIndex] = arr[yIndex];
                        continue;
                    }
                    if (isNumber(value)) {
                        scaleArray[xIndex] = value;
                        scaleArray[yIndex] = value;
                        continue;
                    }
                    throw invalidArg(scale);
                case scaleX:
                    if (isNumber(value)) {
                        scaleArray[xIndex] = value;
                        continue;
                    }
                    throw invalidArg(scaleX);
                case scaleY:
                    if (isNumber(value)) {
                        scaleArray[yIndex] = value;
                        continue;
                    }
                    throw invalidArg(scaleY);
                case scaleZ:
                    if (isNumber(value)) {
                        scaleArray[zIndex] = value;
                        continue;
                    }
                    throw invalidArg(scaleZ);
                case skew:
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 2) {
                            throw invalidArg(skew);
                        }
                        skewArray[xIndex] = arr[xIndex];
                        skewArray[yIndex] = arr[yIndex];
                        continue;
                    }
                    if (isNumber(value)) {
                        skewArray[xIndex] = value;
                        skewArray[yIndex] = value;
                        continue;
                    }
                    throw invalidArg(skew);
                case skewX:
                    if (isString(value)) {
                        skewArray[xIndex] = value;
                        continue;
                    }
                    throw invalidArg(skewX);
                case skewY:
                    if (isString(value)) {
                        skewArray[yIndex] = value;
                        continue;
                    }
                    throw invalidArg(skewY);
                case rotate3d:
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 4) {
                            throw invalidArg(rotate3d);
                        }
                        transformString += " rotate3d(" + arr[0] + "," + arr[1] + "," + arr[2] + "," + arr[3] + ")";
                        continue;
                    }
                    throw invalidArg(rotate3d);
                case rotateX:
                    if (isString(value)) {
                        transformString += " rotate3d(1, 0, 0, " + value + ")";
                        continue;
                    }
                    throw invalidArg(rotateX);
                case rotateY:
                    if (isString(value)) {
                        transformString += " rotate3d(0, 1, 0, " + value + ")";
                        continue;
                    }
                    throw invalidArg(rotateY);
                case rotate:
                case rotateZ:
                    if (isString(value)) {
                        transformString += " rotate3d(0, 0, 1, " + value + ")";
                        continue;
                    }
                    throw invalidArg(rotateZ);
                case translate3d:
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 3) {
                            throw invalidArg(translate3d);
                        }
                        translateArray[xIndex] = arr[xIndex];
                        translateArray[yIndex] = arr[yIndex];
                        translateArray[zIndex] = arr[zIndex];
                        continue;
                    }
                    if (isString(value) || isNumber(value)) {
                        translateArray[xIndex] = value;
                        translateArray[yIndex] = value;
                        translateArray[zIndex] = value;
                        continue;
                    }
                    throw invalidArg(rotate3d);
                case translate:
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 2) {
                            throw invalidArg(translate);
                        }
                        translateArray[xIndex] = arr[xIndex];
                        translateArray[yIndex] = arr[yIndex];
                        continue;
                    }
                    if (isString(value) || isNumber(value)) {
                        translateArray[xIndex] = value;
                        translateArray[yIndex] = value;
                        continue;
                    }
                    throw invalidArg(translate);
                case x:
                case translateX:
                    if (isString(value) || isNumber(value)) {
                        translateArray[xIndex] = value;
                        continue;
                    }
                    throw invalidArg(x);
                case y:
                case translateY:
                    if (isString(value) || isNumber(value)) {
                        translateArray[yIndex] = value;
                        continue;
                    }
                    throw invalidArg(y);
                case z:
                case translateZ:
                    if (isString(value) || isNumber(value)) {
                        translateArray[zIndex] = value;
                        continue;
                    }
                    throw invalidArg(z);
                case transform:
                    transformString += ' ' + value;
                    break;
                default:
                    output[toCamelCase(prop)] = value;
                    break;
            }
        }
        var isScaleX = scaleArray[xIndex] !== undefined;
        var isScaleY = scaleArray[yIndex] !== undefined;
        var isScaleZ = scaleArray[zIndex] !== undefined;
        if (isScaleX && isScaleZ || isScaleY && isScaleZ) {
            var scaleString = scaleArray.map(function (s) { return s || '1'; }).join(',');
            transformString += " scale3d(" + scaleString + ")";
        }
        else if (isScaleX && isScaleY) {
            transformString += " scale(" + (scaleArray[xIndex] || 1) + ", " + (scaleArray[yIndex] || 1) + ")";
        }
        else if (isScaleX) {
            transformString += " scaleX(" + scaleArray[xIndex] + ")";
        }
        else if (isScaleY) {
            transformString += " scaleX(" + scaleArray[yIndex] + ")";
        }
        else if (isScaleZ) {
            transformString += " scaleX(" + scaleArray[zIndex] + ")";
        }
        else {
        }
        var isskewX = skewArray[xIndex] !== undefined;
        var isskewY = skewArray[yIndex] !== undefined;
        if (isskewX && isskewY) {
            transformString += " skew(" + (skewArray[xIndex] || 1) + ", " + (skewArray[yIndex] || 1) + ")";
        }
        else if (isskewX) {
            transformString += " skewX(" + skewArray[xIndex] + ")";
        }
        else if (isskewY) {
            transformString += " skewY(" + skewArray[yIndex] + ")";
        }
        else {
        }
        var istranslateX = translateArray[xIndex] !== undefined;
        var istranslateY = translateArray[yIndex] !== undefined;
        var istranslateZ = translateArray[zIndex] !== undefined;
        if (istranslateX && istranslateZ || istranslateY && istranslateZ) {
            var translateString = translateArray.map(function (s) { return s || '1'; }).join(',');
            transformString += " translate3d(" + translateString + ")";
        }
        else if (istranslateX && istranslateY) {
            transformString += " translate(" + (translateArray[xIndex] || 1) + ", " + (translateArray[yIndex] || 1) + ")";
        }
        else if (istranslateX) {
            transformString += " translateX(" + translateArray[xIndex] + ")";
        }
        else if (istranslateY) {
            transformString += " translateY(" + translateArray[yIndex] + ")";
        }
        else if (istranslateZ) {
            transformString += " translateZ(" + translateArray[zIndex] + ")";
        }
        else {
        }
        if (transformString) {
            output['transform'] = transformString;
        }
        return output;
    }

    var globalAnimations = {};
    function JustAnimate() {
        var self = this;
        self = self instanceof JustAnimate ? self : Object.create(JustAnimate.prototype);
        self._registry = {};
        self._timeLoop = createLoop();
        return self;
    }
    JustAnimate.inject = inject;
    JustAnimate.prototype = {
        _registry: undefined,
        _timeLoop: undefined,
        animate: function (keyframesOrName, targets, timings) {
            var a = resolveArguments(this, keyframesOrName, timings);
            var elements = queryElements(targets);
            var effects = map(elements, function (e) { return createKeyframeAnimation(e, a.keyframes, a.timings); });
            var animator = createMultiAnimator(effects, this._timeLoop);
            animator.play();
            return animator;
        },
        animateSequence: function (options) {
            var _this = this;
            var offset = 0;
            var effectOptions = map(options.steps, function (step) {
                var a = resolveArguments(_this, step.name || step.keyframes, step.timings);
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
                var animations = map(elements, function (e) { return createKeyframeAnimation(e, a.keyframes, a.timings); });
                if (animations.length === 1) {
                    effects.push(animations[0]);
                }
                else if (animations.length > 1) {
                    effects.push(createMultiAnimator(animations, _this._timeLoop));
                }
            });
            var animator = createMultiAnimator(effects, this._timeLoop);
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
            return createTimelineAnimator(options, this._timeLoop);
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
        each(animations, function (a) { return globalAnimations[a.name] = a; });
    }
    function resolveArguments(ctx, keyframesOrName, timings) {
        var keyframes;
        if (isString(keyframesOrName)) {
            var definition = ctx.findAnimation(keyframesOrName);
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
    }

    if (typeof angular !== 'undefined') {
        angular.module('just.animate', []).service('just', JustAnimate);
    }
    window.just = JustAnimate();

}());
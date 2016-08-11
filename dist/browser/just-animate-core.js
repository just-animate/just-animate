(function () {
    'use strict';

    var nothing = undefined;
    var animate = 'animate';
    var cancel = 'cancel';
    var cubicBezier = 'cubic-bezier';
    var duration = 'duration';
    var finish = 'finish';
    var pause = 'pause';
    var play = 'play';
    var reverse = 'reverse';
    var rotate = 'rotate';
    var rotate3d = 'rotate3d';
    var rotateX = 'rotateX';
    var rotateY = 'rotateY';
    var rotateZ = 'rotateZ';
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

    var slice = Array.prototype.slice;
    var push = Array.prototype.push;
    ;
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
            if (result !== nothing) {
                results.push(result);
            }
        }
        return results;
    }
    function pushAll(source, target) {
        push.apply(source, target);
    }

    var ostring = Object.prototype.toString;
    function isArray(a) {
        return !isString(a) && isNumber(a.length);
    }
    function isDefined(a) {
        return a !== nothing && a !== null && a !== '';
    }
    function isFunction(a) {
        return ostring.call(a) === '[object Function]';
    }
    function isNumber(a) {
        return typeof a === 'number';
    }
    function isObject(a) {
        return typeof a === 'object' && a !== null;
    }
    function isString(a) {
        return typeof a === 'string';
    }

    var inherit = function () {
        var args = arguments;
        var target = args[0];
        for (var i = 1, len = args.length; i < len; i++) {
            var source = args[i];
            for (var propName in source) {
                if (!isDefined(target[propName])) {
                    target[propName] = source[propName];
                }
            }
        }
        return target;
    };
    var expand = function (expandable) {
        var result = {};
        for (var prop in expandable) {
            var propVal = expandable[prop];
            if (isFunction(propVal)) {
                propVal = propVal();
            }
            else if (isObject(propVal)) {
                propVal = expand(propVal);
            }
            result[prop] = propVal;
        }
        return result;
    };
    function unwrap(value) {
        if (isFunction(value)) {
            return value();
        }
        return value;
    }
    ;

    function inRange(val, min, max) {
        return min < max ? min <= val && val <= max : max <= val && val <= min;
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

    function Dispatcher() {
        var self = this;
        self = self instanceof Dispatcher ? self : Object.create(Dispatcher.prototype);
        self._fn = {};
        return self;
    }
    Dispatcher.prototype = {
        _fn: nothing,
        trigger: function (eventName, args) {
            var listeners = this._fn[eventName];
            if (!listeners) {
                return;
            }
            var len = listeners.length;
            for (var i = 0; i < len; i++) {
                listeners[i].apply(nothing, args);
            }
        },
        on: function (eventName, listener) {
            if (!isFunction(listener)) {
                throw invalidArg('listener');
            }
            var fn = this._fn;
            var listeners = fn[eventName];
            if (!listeners) {
                fn[eventName] = [listener];
                return;
            }
            if (listeners.indexOf(listener) !== -1) {
                return;
            }
            listeners.push(listener);
        },
        off: function (eventName, listener) {
            var listeners = this._fn[eventName];
            if (listeners) {
                var indexOfListener = listeners.indexOf(listener);
                if (indexOfListener !== -1) {
                    listeners.splice(indexOfListener, 1);
                }
            }
        }
    };

    function KeyframeAnimation(target, keyframes, options) {
        var self = this instanceof KeyframeAnimation ? this : Object.create(KeyframeAnimation.prototype);
        var duration = options.to - options.from;
        self._iterationStart = unwrap(options.iterationStart) || 0;
        self._iterations = unwrap(options.iterations) || 1;
        self._duration = duration;
        self._startTime = options.from || 0;
        self._endTime = options.to;
        self._totalDuration = (self._iterations || 1) * duration;
        var dispatcher = Dispatcher();
        self._dispatcher = dispatcher;
        var animator = target[animate](keyframes, {
            delay: unwrap(options.delay) || undefined,
            direction: unwrap(options.direction),
            duration: duration,
            easing: options.easing || 'linear',
            fill: options.fill || 'none',
            iterationStart: self._iterationStart,
            iterations: self._iterations
        });
        animator.cancel();
        animator['onfinish'] = function () { return dispatcher.trigger(finish); };
        self._animator = animator;
        return self;
    }
    KeyframeAnimation.prototype = {
        _dispatcher: nothing,
        _duration: nothing,
        _endTime: nothing,
        _iterationStart: nothing,
        _iterations: nothing,
        _startTime: nothing,
        _totalDuration: nothing,
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

    var camelCaseRegex = /([a-z])[- ]([a-z])/ig;
    function camelCaseReplacer(match, p1, p2) {
        return p1 + p2.toUpperCase();
    }
    function toCamelCase(value) {
        return isString(value) ? value.replace(camelCaseRegex, camelCaseReplacer) : nothing;
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
                if (prop !== offset && !isDefined(first[prop])) {
                    first[prop] = keyframe[prop];
                }
            }
        }
        for (var i = len - 2; i > -1; i--) {
            var keyframe = keyframes[i];
            for (var prop in keyframe) {
                if (prop !== offset && !isDefined(last[prop])) {
                    last[prop] = keyframe[prop];
                }
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
        var isScaleX = scaleArray[xIndex] !== nothing;
        var isScaleY = scaleArray[yIndex] !== nothing;
        var isScaleZ = scaleArray[zIndex] !== nothing;
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
        var isskewX = skewArray[xIndex] !== nothing;
        var isskewY = skewArray[yIndex] !== nothing;
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
        var istranslateX = translateArray[xIndex] !== nothing;
        var istranslateY = translateArray[yIndex] !== nothing;
        var istranslateZ = translateArray[zIndex] !== nothing;
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

    var animationPadding = 1.0 / 30;
    function Animator(resolver, timeloop) {
        var self = this instanceof Animator ? this : Object.create(Animator.prototype);
        if (!isDefined(duration)) {
            throw invalidArg(duration);
        }
        self._duration = 0;
        self._totalDuration = 0;
        self._currentTime = nothing;
        self._iterationStart = 0;
        self._iterations = 1;
        self._lastTick = nothing;
        self._playState = 'idle';
        self._playbackRate = 1;
        self._startTime = 0;
        self._events = [];
        self._resolver = resolver;
        self._timeLoop = timeloop;
        self._dispatcher = Dispatcher();
        self._onTick = self._onTick.bind(self);
        self.on(finish, self._onFinish);
        self.on(cancel, self._onCancel);
        self.on(pause, self._onPause);
        return self;
    }
    Animator.prototype = {
        _currentTime: nothing,
        _dispatcher: nothing,
        _duration: nothing,
        _endTime: nothing,
        _events: nothing,
        _iterationStart: nothing,
        _iterations: nothing,
        _lastTick: nothing,
        _playState: nothing,
        _playbackRate: nothing,
        _resolver: nothing,
        _startTime: nothing,
        _timeLoop: nothing,
        _totalDuration: nothing,
        animate: function (options) {
            var self = this;
            if (isArray(options)) {
                each(options, function (e) { return self._addEvent(e); });
            }
            else {
                self._addEvent(options);
            }
            self._recalculate();
            return self;
        },
        duration: function () {
            return this._duration;
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
        endTime: function () {
            return this._endTime;
        },
        startTime: function () {
            return this._startTime;
        },
        currentTime: function (value) {
            var self = this;
            if (!isDefined(value)) {
                return self._currentTime;
            }
            self._currentTime = value;
            return self;
        },
        playbackRate: function (value) {
            var self = this;
            if (!isDefined(value)) {
                return self._playbackRate;
            }
            self._playbackRate = value;
            return self;
        },
        playState: function (value) {
            var self = this;
            if (!isDefined(value)) {
                return self._playState;
            }
            self._playState = value;
            self._dispatcher.trigger('set', ['playbackState', value]);
            return self;
        },
        on: function (eventName, listener) {
            var self = this;
            self._dispatcher.on(eventName, listener);
            return self;
        },
        off: function (eventName, listener) {
            var self = this;
            self._dispatcher.off(eventName, listener);
            return self;
        },
        finish: function () {
            var self = this;
            self._dispatcher.trigger(finish, [self]);
            return self;
        },
        play: function () {
            var self = this;
            if (self._playState !== 'running' || self._playState !== 'pending') {
                self._playState = 'pending';
                self._timeLoop.on(self._onTick);
            }
            return self;
        },
        pause: function () {
            var self = this;
            self._dispatcher.trigger(pause, [self]);
            return self;
        },
        reverse: function () {
            var self = this;
            self._playbackRate *= -1;
            return self;
        },
        cancel: function () {
            var self = this;
            self._dispatcher.trigger(cancel, [self]);
            return self;
        },
        _recalculate: function () {
            var self = this;
            var endsAt = maxBy(self._events, function (e) { return e.startTimeMs + e.animator.totalDuration(); });
            self._endTime = endsAt;
            self._duration = endsAt;
            self._totalDuration = endsAt;
        },
        _addEvent: function (event) {
            var self = this;
            var targets = queryElements(event.targets);
            if (event.name) {
                var def = self._resolver.findAnimation(event.name);
                if (!isDefined(def)) {
                    throw invalidArg('name');
                }
                inherit(event, def);
            }
            event.from = event.from || 0;
            event.to = event.to || 0;
            if (!event.easing) {
                event.easing = 'linear';
            }
            else {
                event.easing = easings[event.easing] || event.easing;
            }
            var animators = map(targets, function (e) {
                var to = event.to + self._duration;
                var from = event.from + self._duration;
                var expanded = map(event.keyframes, expand);
                var normalized = map(expanded, normalizeProperties);
                var keyframes = pipe(normalized, spaceKeyframes, normalizeKeyframes);
                return {
                    animator: KeyframeAnimation(e, keyframes, event),
                    endTimeMs: to,
                    startTimeMs: from
                };
            });
            pushAll(self._events, animators);
        },
        _onCancel: function (self) {
            self._timeLoop.off(self._onTick);
            self._currentTime = 0;
            self._playState = 'idle';
            self._lastTick = nothing;
            each(self._events, function (evt) { evt.animator.cancel(); });
        },
        _onFinish: function (self) {
            self._timeLoop.off(self._onTick);
            self._currentTime = 0;
            self._playState = 'finished';
            self._lastTick = nothing;
            each(self._events, function (evt) { evt.animator.finish(); });
        },
        _onPause: function (self) {
            self._timeLoop.off(self._onTick);
            self._playState = 'paused';
            self._lastTick = nothing;
            each(self._events, function (evt) { evt.animator.pause(); });
        },
        _onTick: function (delta2, runningTime2) {
            var self = this;
            var dispatcher = self._dispatcher;
            var playState = self._playState;
            if (playState === 'idle') {
                dispatcher.trigger(cancel, [self]);
                return;
            }
            if (playState === 'finished') {
                dispatcher.trigger(finish, [self]);
                return;
            }
            if (playState === 'paused') {
                dispatcher.trigger(pause, [self]);
                return;
            }
            var playbackRate = self._playbackRate;
            var isReversed = playbackRate < 0;
            var duration1 = self._duration;
            var startTime = isReversed ? duration1 : 0;
            var endTime = isReversed ? 0 : duration1;
            if (self._playState === 'pending') {
                var currentTime_1 = self._currentTime;
                self._currentTime = currentTime_1 === nothing || currentTime_1 === endTime ? startTime : currentTime_1;
                self._playState = 'running';
            }
            var thisTick = performance.now();
            var lastTick = self._lastTick;
            if (lastTick !== nothing) {
                var delta = (thisTick - lastTick) * playbackRate;
                self._currentTime += delta;
            }
            self._lastTick = thisTick;
            var currentTime = self._currentTime;
            if (!inRange(currentTime, startTime, endTime)) {
                dispatcher.trigger(finish, [self]);
                return;
            }
            var events = self._events;
            var eventLength = events.length;
            for (var i = 0; i < eventLength; i++) {
                var evt = events[i];
                var startTimeMs = playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
                var endTimeMs = playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
                var shouldBeActive = startTimeMs <= currentTime && currentTime < endTimeMs;
                if (shouldBeActive) {
                    var animator = evt.animator;
                    animator.playbackRate(playbackRate);
                    animator.play();
                }
            }
        }
    };

    var now = (performance && performance.now) ? function () { return performance.now(); } : function () { return Date.now(); };
    var raf = (window.requestAnimationFrame !== nothing)
        ? function (ctx, fn) {
            window.requestAnimationFrame(function () { fn(ctx); });
        }
        : function (ctx, fn) {
            setTimeout(function () { fn(ctx); }, 16.66);
        };
    function TimeLoop() {
        var self = this instanceof TimeLoop ? this : Object.create(TimeLoop.prototype);
        self.active = [];
        self.elapses = [];
        self.isActive = nothing;
        self.lastTime = nothing;
        self.offs = [];
        self.ons = [];
        return self;
    }
    TimeLoop.prototype = {
        on: function (fn) {
            var self = this;
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
        },
        off: function (fn) {
            var self = this;
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
    };
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
            self.isActive = nothing;
            self.lastTime = nothing;
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

    function AnimationResolver() {
        var self = this instanceof AnimationResolver ? this : Object.create(AnimationResolver.prototype);
        self.defs = {};
        return self;
    }
    var animations = {};
    AnimationResolver.prototype = {
        defs: nothing,
        findAnimation: function (name) {
            return this.defs[name] || animations[name] || nothing;
        },
        registerAnimation: function (animationOptions, isGlobal) {
            if (isGlobal) {
                animations[animationOptions.name] = animationOptions;
                return;
            }
            this.defs[animationOptions.name] = animationOptions;
        }
    };

    function JustAnimate() {
        var self = this;
        self = self instanceof JustAnimate ? self : Object.create(JustAnimate.prototype);
        self._registry = {};
        self._resolver = AnimationResolver();
        self._timeLoop = TimeLoop();
        return self;
    }
    JustAnimate.inject = inject;
    JustAnimate.prototype = {
        _resolver: nothing,
        _timeLoop: nothing,
        animate: function (options) {
            var animator = Animator(this._resolver, this._timeLoop);
            animator.animate(options);
            return animator;
        },
        register: function (preset) {
            this._resolver.registerAnimation(preset, false);
        },
        inject: inject
    };
    function inject(animations) {
        var resolver = AnimationResolver();
        each(animations, function (a) { return resolver.registerAnimation(a, true); });
    }

    if (typeof angular !== 'undefined') {
        angular.module('just.animate', []).service('just', JustAnimate);
    }
    window.just = JustAnimate();

}());
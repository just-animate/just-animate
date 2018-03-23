var JA = (function (exports) {
'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var Observable = (function () {
    function Observable() {
        this.subs = [];
        this.buffer = [];
    }
    Observable.prototype.next = function (n) {
        var self = this;
        var buffer = self.buffer;
        buffer.push(n);
        if (buffer.length > 1) {
            return;
        }
        for (var h = 0; h < buffer.length; h++) {
            var subs2 = self.subs.slice();
            n = buffer[h];
            for (var i = 0; i < subs2.length; i++) {
                subs2[i](n);
            }
        }
        buffer.length = 0;
    };
    Observable.prototype.subscribe = function (fn) {
        var subs = this.subs;
        subs.push(fn);
        return {
            unsubscribe: function () {
                var index = subs.indexOf(fn);
                if (index !== -1) {
                    subs.splice(index, 1);
                }
            }
        };
    };
    return Observable;
}());

var ops = [];
var frame;
function scheduler(fn) {
    return function () {
        ops.push(fn);
        frame = frame || setTimeout(nextTick) || 1;
    };
}
function nextTick() {
    for (var i = 0; i < ops.length; i++) {
        ops[i]();
    }
    frame = ops.length = 0;
}

var Timer = (function (_super) {
    __extends(Timer, _super);
    function Timer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tick = function (timeStamp) {
            var self = _this;
            var delta = -(self.time || timeStamp) + (self.time = timeStamp);
            self.next(delta);
        };
        return _this;
    }
    Timer.prototype.next = function (n) {
        var self = this;
        _super.prototype.next.call(this, n);
        if (self.subs.length) {
            requestAnimationFrame(self.tick);
        }
    };
    Timer.prototype.subscribe = function (fn) {
        var self = this;
        if (!self.subs.length) {
            requestAnimationFrame(self.tick);
        }
        return _super.prototype.subscribe.call(this, fn);
    };
    return Timer;
}(Observable));
var timer = new Timer();

function Proxy$1(target, handler) {
    var configuration = {};
    var _loop_1 = function (key) {
        configuration[key] = {
            enumerable: true,
            get: function () {
                return handler.get ? handler.get(target, key) : target[key];
            },
            set: function (val) {
                if (handler.set) {
                    handler.set(target, key, val, undefined);
                }
                else {
                    target[key] = val;
                }
            }
        };
    };
    for (var key in target) {
        _loop_1(key);
    }
    var proxy = {};
    Object.defineProperties(proxy, configuration);
    if (handler.deleteProperty || handler.set) {
        var lastProps_1 = Object.keys(proxy);
        var lastValue_1 = lastProps_1 + '';
        (function detectChanges() {
            setTimeout(detectChanges, 1000 / 60);
            var nextProps = Object.keys(proxy);
            var nextValue = nextProps + '';
            if (nextValue === lastValue_1) {
                return;
            }
            lastProps_1 = nextProps;
            lastValue_1 = nextValue;
            if (handler.deleteProperty) {
                lastProps_1
                    .filter(function (p) { return nextProps.indexOf(p) !== -1; })
                    .forEach(function (key) {
                    handler.deleteProperty(target, key);
                });
            }
            if (handler.set) {
                nextProps
                    .filter(function (p) { return lastProps_1.indexOf(p) !== -1; })
                    .forEach(function (key) {
                    handler.set(target, key, target[key], undefined);
                });
            }
        })();
    }
    return proxy;
}

function ObservableProxy(target) {
    target = target || {};
    var observable = new Observable();
    var newProps = [];
    var propertyChanged = scheduler(function () {
        var nextVal = newProps;
        if (newProps.length) {
            newProps = [];
            observable.next(nextVal);
        }
    });
    var handler = {
        set: function (t, prop, value, _receiver) {
            t[prop] = value;
            if (newProps.indexOf(prop) === -1) {
                newProps.push(prop);
            }
            propertyChanged();
            return true;
        },
        deleteProperty: function (t, prop) {
            delete t[prop];
            if (newProps.indexOf(prop) === -1) {
                newProps.push(prop);
            }
            propertyChanged();
            return true;
        }
    };
    var proxy = new (typeof Proxy !== 'undefined' ? Proxy : Proxy$1)(target, handler);
    Object.defineProperty(proxy, 'subscribe', {
        enumerable: false,
        configurable: false,
        value: observable.subscribe.bind(observable)
    });
    return proxy;
}

var refs = ObservableProxy();

var middlewares = [];
var use = function (middleware) {
    if (middlewares.indexOf(middleware) === -1) {
        middlewares.push(middleware);
    }
};

var REMOVE = 3;
var ADD = 1;
var REPLACE = 2;
var IDLE = 'idle';

var timelines = ObservableProxy();
timelines.subscribe(function (props) {
    props.forEach(function (prop) {
        var last = timelines[prop];
        if (last) {
            last.setState({ state: IDLE });
        }
    });
});

var push = Array.prototype.push;
var MAX_LEVEL = 2;
function $(parent, e) {
    return !e || e.length === 0
        ?
            []
        : e.nodeName
            ?
                [e]
            :
                [].slice.call(e[0].nodeName
                    ? e
                    : (parent || document).querySelectorAll(e));
}
function isArray(a) {
    return a && typeof a !== 'string' && typeof a.length === 'number';
}
function isDefined(a) {
    return a !== undefined && a !== null;
}
function isString(a) {
    return typeof a === 'string';
}

function pushAll(c, n) {
    if (isArray(n)) {
        push.apply(c, n);
    }
    else {
        push.call(c, n);
    }
    return c;
}
function diff(a, b) {
    return diffInner(a, b, [], 1);
}
function diffInner(a, b, walked, level) {
    var changes = {};
    for (var name in a) {
        var aValue = a[name];
        var bValue = b[name];
        var aType = typeof aValue;
        var bType = typeof bValue;
        if (isDefined(aValue) && aType === 'object') {
            if (walked.indexOf(aValue) !== -1) {
                continue;
            }
            walked.push(aValue);
        }
        if (!isDefined(bValue)) {
            changes[name] = REMOVE;
        }
        else if (aType !== bType) {
            changes[name] = REPLACE;
        }
        else if (bType === 'object') {
            var c = diffInner(aValue, bValue, walked, level + 1);
            if (c) {
                changes[name] = c;
            }
        }
        else if (aValue !== bValue) {
            changes[name] = REPLACE;
        }
    }
    for (var name in b) {
        if (!isDefined(a[name])) {
            changes[name] = ADD;
        }
    }
    return keys(changes).length
        ? level > MAX_LEVEL ? REPLACE : changes
        : undefined;
}
function copyInclude(source, inclusions) {
    var dest = {};
    for (var i = 0, iLen = inclusions.length; i < iLen; i++) {
        dest[inclusions[i]] = source[inclusions[i]];
    }
    return dest;
}
function copyExclude(source, exclusions, dest) {
    dest = dest || {};
    for (var key in source) {
        if (!exclusions || exclusions.indexOf(key) === -1) {
            dest[key] = source[key];
        }
    }
    return dest;
}
var keys = Object.keys;

var Timeline = (function () {
    function Timeline(options) {
        var _this = this;
        this.tick = function (delta) {
            var state = _this.state;
            _this.seek(state.time + state.rate * delta);
        };
        var self = this;
        self.state = {
            time: 0,
            rate: 1,
            state: IDLE,
            alternate: false,
            repeat: 1
        };
        self.duration = 0;
        self.animations = [];
        self.events = {};
        self.targets = {};
        options = options || {};
        self.labels = ObservableProxy(options.labels);
        self.refs = ObservableProxy(options.refs);
        timelines[options.name] = self;
    }
    Timeline.prototype.import = function (options) {
        if (options.duration) {
            this.duration = options.duration;
        }
        if (options.labels) {
            for (var name in this.labels) {
                if (!isDefined(options.labels[name])) {
                    delete this.labels[name];
                }
            }
            for (var name in options.labels) {
                this.labels[name] = options.labels[name];
            }
        }
        if (options.targets) {
            updateTargets(this, options.targets);
        }
        return this;
    };
    Timeline.prototype.export = function () {
        var self = this;
        return {
            duration: self.duration,
            labels: self.labels,
            targets: self.targets
        };
    };
    Timeline.prototype.getState = function () {
        return this.state;
    };
    Timeline.prototype.setState = function (options) {
        var self = this;
        var nextState = copyExclude(options, undefined, self.state);
        var shouldFireFinish;
        if (nextState.state === 'running') {
            var isForwards = nextState.rate >= 0;
            var duration = self.duration;
            if (isForwards && nextState.time >= duration) {
                nextState.time = duration;
                nextState.state = 'paused';
                shouldFireFinish = true;
            }
            else if (!isForwards && nextState.time <= 0) {
                nextState.time = 0;
                nextState.state = 'paused';
                shouldFireFinish = true;
            }
        }
        if (!self._sub && nextState.state === 'running') {
            self._sub = timer.subscribe(self.tick);
        }
        if (self._sub && nextState.state !== 'running') {
            self._sub.unsubscribe();
            self._sub = undefined;
        }
        self.animations.forEach(function (a) {
            a.updated(nextState);
        });
        self.emit('update');
        if (shouldFireFinish) {
            self.emit('finish');
        }
        return self;
    };
    Timeline.prototype.seek = function (timeOrLabel) {
        var self = this;
        self.setState({
            time: isString(timeOrLabel)
                ? self.labels[timeOrLabel]
                : timeOrLabel
        });
        return self;
    };
    Timeline.prototype.emit = function (event) {
        var evt = this.events[event];
        if (evt) {
            var handlers = evt.slice();
            for (var i = 0, iLen = handlers.length; i < iLen; i++) {
                handlers[i]();
            }
        }
        return this;
    };
    Timeline.prototype.on = function (event, listener) {
        var evt = this.events[event] || (this.events[event] = []);
        if (evt.indexOf(listener) === -1) {
            evt.push(listener);
        }
        return this;
    };
    Timeline.prototype.off = function (event, listener) {
        var evt = this.events[event];
        if (evt) {
            var index = evt.indexOf(listener);
            if (index !== -1) {
                evt.splice(index, 1);
            }
        }
        return this;
    };
    return Timeline;
}());
function updateTargets(self, targets) {
    var changes = diff(self.targets, targets);
    if (changes) {
        self.targets = targets;
        self.emit('config');
        updateEffects(self, changes);
    }
}
function updateEffects(self, changes) {
    var animations = self.animations;
    for (var i = animations.length - 1; i > -1; i--) {
        var animation = animations[i];
        var type = changes[animation.target];
        if (type === REMOVE || type === REPLACE) {
            animations.splice(i, 1);
            animation.destroyed();
        }
    }
    for (var selector in changes) {
        var type = changes[selector];
        if (type === REMOVE) {
            continue;
        }
        var properties = self.targets[selector];
        var propertyJSON = void 0;
        if (type === ADD || type === REPLACE) {
            propertyJSON = properties;
        }
        else {
            propertyJSON = copyInclude(properties, keys(changes).filter(function (p) { return changes[p] === ADD || changes[p] === REPLACE; }));
        }
        var newAnimations = createAnimations(self, selector, propertyJSON);
        if (newAnimations.length) {
            newAnimations.forEach(function (n) {
                n.created();
            });
            pushAll(animations, newAnimations);
        }
    }
}
function resolveSelectors(self, selectors) {
    return selectors
        .split(',')
        .map(function (s) {
        return isString(s) && s[0] === '@'
            ? resolveRefs(self, s)
            : $(self.el, s);
    })
        .reduce(pushAll, []);
}
function resolveRefs(self, ref) {
    var refName = ref.substring(1);
    return self.refs[refName] || refs[refName];
}
function createAnimations(self, selector, properties) {
    var duration = self.duration;
    var targets = resolveSelectors(self, selector);
    var newAnimations = [];
    for (var i = 0, tLen = targets.length; i < tLen; i++) {
        var target = targets[i];
        var handled = [];
        var props = properties;
        for (var m = 0, mLen = middlewares.length; m < mLen; m++) {
            if (!keys(props).length) {
                break;
            }
            var animations = middlewares[m]({
                target: target,
                duration: duration,
                props: props
            });
            if (!animations || !animations.length) {
                continue;
            }
            pushAll(newAnimations, animations);
            handled = animations.map(selectProps).reduce(pushAll, handled);
            props = copyExclude(props, handled);
        }
    }
    return newAnimations;
}
function selectProps(a) {
    return a.props;
}

var RUNNING = 'running';
var frameSize = 17;
use(function (effect) {
    var target = effect.target;
    if (!(target instanceof Element)) {
        return undefined;
    }
    var duration = effect.duration || 1;
    return keys(effect.props).map(function (propertyName) {
        var config = effect.props[propertyName];
        var times = keys(config)
            .map(function (c) { return +c; })
            .filter(function (c) { return isFinite(c) && c >= 0 && c <= duration; })
            .sort();
        var hasStart, hasEnd;
        var keyframes = [];
        for (var i = 0, tLen = times.length; i < tLen; i++) {
            var time = times[i];
            var timeConfig = config[time];
            var offset = time / duration;
            if (offset === 0) {
                hasStart = true;
            }
            if (offset === 1) {
                hasEnd = true;
            }
            if (timeConfig.type === 'set') {
                var lastIndex = i - 1;
                var lastFrame = lastIndex > -1 &&
                    config[times[lastIndex]];
                if (lastFrame) {
                    keyframes.push((_a = {
                            offset: offset - 0.0000001,
                            easing: 'step-start'
                        }, _a[propertyName] = lastFrame.value, _a));
                }
            }
            var nextIndex = i + 1;
            var nextFrame = nextIndex < tLen &&
                config[times[nextIndex]];
            var easing = (nextFrame && nextFrame.easing) || 'linear';
            keyframes.push((_b = {
                    offset: offset,
                    easing: easing
                }, _b[propertyName] = timeConfig.value, _b));
        }
        if (!hasStart) {
            var lastKeyframe = copyExclude(keyframes[0]);
            lastKeyframe.offset = 0;
            keyframes.push(lastKeyframe);
        }
        if (!hasEnd) {
            var lastKeyframe = copyExclude(keyframes[keyframes.length - 1]);
            lastKeyframe.offset = 1;
            keyframes.push(lastKeyframe);
        }
        var animator;
        return {
            props: [propertyName],
            created: function () {
                animator = target.animate(keyframes, {
                    duration: effect.duration,
                    fill: 'both'
                });
                animator.pause();
            },
            updated: function (ctx) {
                var time = ctx.time;
                var rate = ctx.rate;
                var isPlaying = ctx.state === RUNNING;
                if (Math.abs(animator.currentTime - time) > 1) {
                    animator.currentTime = time;
                }
                if (isPlaying && animator.playbackRate !== rate) {
                    var currentTime = animator.currentTime;
                    if (currentTime < 1) {
                        animator.currentTime = 1;
                    }
                    else if (currentTime >= effect.duration - 1) {
                        animator.currentTime = effect.duration - 1;
                    }
                    animator.playbackRate = rate;
                }
                var needsToPlay = isPlaying &&
                    !(animator.playState === RUNNING ||
                        animator.playState === 'finished') &&
                    !(rate < 0 && time < frameSize) &&
                    !(rate >= 0 && time > effect.duration - frameSize);
                if (needsToPlay) {
                    animator.play();
                }
                var needsToPause = !isPlaying &&
                    (animator.playState === RUNNING ||
                        animator.playState === 'pending');
                if (needsToPause) {
                    animator.pause();
                }
            },
            destroyed: function () {
                animator.cancel();
            }
        };
        var _a, _b;
    });
});

exports.Observable = Observable;
exports.nextTick = nextTick;
exports.scheduler = scheduler;
exports.timer = timer;
exports.refs = refs;
exports.use = use;
exports.timelines = timelines;
exports.Timeline = Timeline;

return exports;

}({}));

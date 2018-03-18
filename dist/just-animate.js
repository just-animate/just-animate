var JA = (function (exports) {
'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var REMOVE = 3;
var ADD = 1;
var REPLACE = 2;
var IDLE = 'idle';

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
function isDefined(a) {
    return a !== undefined && a !== null;
}
function isString(a) {
    return typeof a === 'string';
}

function pushAll(c, n) {
    Array.prototype.push.apply(c, n);
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
        if (exclusions && exclusions.indexOf(key) === -1) {
            dest[key] = source[key];
        }
    }
    return dest;
}
var keys = Object.keys;

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

function dict(initialValue, onUpdate) {
    onUpdate = onUpdate || defaultUpdater;
    var properties = {};
    var values = initialValue || {};
    var setter = function (key, value) {
        values[key] = value;
    };
    var propertyUpdated = scheduler(function () {
        var newProperties = properties;
        properties = {};
        onUpdate(newProperties, setter);
    });
    return {
        keys: function () {
            return keys(values);
        },
        set: function (key, value) {
            if (isDefined(key)) {
                properties[key] = value;
                propertyUpdated();
            }
        },
        get: function (key) {
            return values[key];
        },
        export: function () {
            return JSON.parse(JSON.stringify(values));
        },
        import: function (data) {
            onUpdate(data, setter);
        }
    };
}
function defaultUpdater(values, setter) {
    for (var key in values) {
        setter(key, values[key]);
    }
}

var easings = dict({});

var refs = dict({});

var middlewares = [];
var use = function (middleware) {
    if (middlewares.indexOf(middleware) === -1) {
        middlewares.push(middleware);
    }
};

var timelines = dict({}, function (partial, set) {
    for (var key in partial) {
        var last = timelines.get(key);
        if (last) {
            last.setState({ state: IDLE });
        }
        set(key, partial[key]);
    }
});

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

function Timeline(options) {
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
    self.labels = dict(options.labels);
    self.refs = dict(options.refs);
    self.tick = self.tick.bind(self);
    timelines.set(options.name, this);
}
Timeline.prototype.imports = function (options) {
    if (options.labels) {
        this.labels.import(options.labels);
    }
    if (options.targets) {
        updateTargets(this, options.targets);
    }
    return this;
};
Timeline.prototype.exports = function () {
    var self = this;
    return {
        duration: self.duration,
        labels: self.labels.export(),
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
Timeline.prototype.tick = function (delta) {
    var state = this.state;
    this.seek(state.time + state.rate * delta);
};
Timeline.prototype.seek = function (timeOrLabel) {
    var self = this;
    self.setState({
        time: isString(timeOrLabel)
            ? self.labels.get(timeOrLabel)
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
    });
}
function resolveRefs(self, ref) {
    var refName = ref.substring(1);
    return self.refs.get(refName) || refs.get(refName);
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

exports.easings = easings;
exports.refs = refs;
exports.use = use;
exports.nextTick = nextTick;
exports.scheduler = scheduler;
exports.timelines = timelines;
exports.Timeline = Timeline;
exports.Observable = Observable;
exports.timer = timer;

return exports;

}({}));

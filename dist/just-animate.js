var JA = (function (exports) {
'use strict';

var globals = {
    labels: {},
    mixers: {},
    refs: {}
};

function clone() {
    var args = arguments;
    var target = {};
    for (var i = 0; i < args.length; i++) {
        var source = args[i];
        for (var prop in source) {
            target[prop] = source[prop];
        }
    }
    return target;
}

function addOrGet(obj, prop) {
    return obj[prop] || (obj[prop] = {});
}

function isDefined(a) {
    return !!a || a === 0 || a === false;
}
function isFunction(a) {
    return typeof a === 'function';
}


function isString(a) {
    return typeof a === 'string';
}
function isArrayLike(a) {
    return a && isFinite(a.length) && !isString(a) && !isFunction(a);
}

var _ = undefined;

function remove(items, item) {
    var index = items.indexOf(item);
    return index !== -1 ? items.splice(index, 1) : _;
}

function list(indexed) {
    return !isDefined(indexed) ? [] : isArrayLike(indexed) ? indexed : [indexed];
}

function timeline(options) {
    return new Timeline(options);
}
var Timeline = (function () {
    function Timeline(options) {
        var self = this;
        self._state = 'idle';
        self._rate = 1;
        self.start = 0;
        self.events = {};
        self.targets = {};
        self.labels = clone(globals.labels, options.labels);
    }
    Object.defineProperty(Timeline.prototype, "duration", {
        get: function () {
            return Math.max(calculateDuration(this), this._duration);
        },
        set: function (value) {
            this._duration = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "currentTime", {
        get: function () {
            return this._time;
        },
        set: function (value) {
            var self = this;
            self._time = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "playbackRate", {
        get: function () {
            return this._rate;
        },
        set: function (value) {
            var self = this;
            self._rate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "playbackState", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            var self = this;
            self._state = value;
        },
        enumerable: true,
        configurable: true
    });
    Timeline.prototype.set = function (target, props, position) {
        var self = this;
        addSingleKeyframe(self, target, 0, props, 'set', position);
        keyframesUpdated(self);
        return self;
    };
    Timeline.prototype.to = function (target, duration, props, position) {
        var self = this;
        addSingleKeyframe(this, target, duration, props, 'tween', position);
        keyframesUpdated(self);
        return self;
    };
    Timeline.prototype.play = function (_options) {
        return this;
    };
    Timeline.prototype.cancel = function () {
        return this;
    };
    Timeline.prototype.finish = function () {
        return this;
    };
    Timeline.prototype.restart = function () {
        return this.cancel().play();
    };
    Timeline.prototype.reverse = function () {
        this.playbackRate *= -1;
        return this;
    };
    Timeline.prototype.seek = function (time) {
        var self = this;
        var t = resolveLabel(self, time);
        isFinite(t) && (self.currentTime = t);
        return self;
    };
    Timeline.prototype.export = function () {
        return {
            duration: this.duration,
            targets: this.targets,
            labels: this.labels,
            player: {
                currentTime: this.currentTime,
                playbackState: this.playbackState,
                playbackRate: this.playbackRate
            }
        };
    };
    Timeline.prototype.import = function (json) {
        var self = this;
        if (isDefined(json.labels)) {
            self.labels = json.labels;
        }
        if (isDefined(json.targets)) {
            self.targets = json.targets;
        }
        if (isDefined(json.player)) {
            self.playbackRate = json.player.playbackRate;
            self.playbackState = json.player.playbackState;
            self.currentTime = json.player.currentTime;
        }
        if (isDefined(json.duration)) {
            self.duration = json.duration;
        }
        keyframesUpdated(self);
        return self;
    };
    Timeline.prototype.on = function (eventName, callback) {
        var h = this.events;
        var hs = h[eventName] || (h[eventName] = []);
        hs.push(callback);
        return this;
    };
    Timeline.prototype.off = function (eventName, callback) {
        var hs = this.events[eventName];
        hs && remove(hs, callback);
        return this;
    };
    return Timeline;
}());
function emit(self, eventName) {
    var hs = self.events[eventName];
    if (hs) {
        hs = hs.slice();
        for (var i = 0; i < hs.length; i++) {
            hs[i]();
        }
    }
}
function resolveTime(self, at, to) {
    return (resolveLabel(self, at) || self.start) + to;
}
function addSingleKeyframe(self, target, duration, props, type, position) {
    var selectors = list(target);
    var selector = selectors.join(',');
    var end = resolveTime(self, position, duration);
    var limit = props.$limit || _;
    var staggerStart = props.$staggerStart || 0;
    var startEnd = props.$startEnd || 0;
    var easing = (props.$easing || undefined);
    for (var key in props) {
        if (key.indexOf('$') !== 0) {
            insertKeyframe(self, selector, key, end, props[key], type, easing, limit, staggerStart, startEnd);
        }
    }
    updatePosition(self, end);
    return end;
}
function insertKeyframe(self, selector, key, time, nextVal, type, easing, limit, staggerStart, staggerEnd) {
    var target = addOrGet(self.targets, selector);
    var prop = addOrGet(target, key);
    var event = addOrGet(prop, time + '');
    event.value = nextVal;
    event.type = type;
    easing && (event.easing = easing);
    limit && (event.limit = limit);
    staggerStart && (event.staggerStart = staggerStart);
    staggerEnd && (event.staggerEnd = staggerEnd);
}
function updatePosition(self, end) {
    self.start = Math.max(self.start, end);
}
function keyframesUpdated(self) {
    emit(self, 'config');
    if (self.playbackState !== 'idle') {
        return;
    }
}
function resolveLabel(self, time) {
    return (isString(time) && self.labels[time]) || +time;
}
function calculateDuration(self) {
    var duration = 0;
    var targets = self.targets;
    for (var selector in targets) {
        var props = targets[selector];
        for (var time in props) {
            if (duration < +time) {
                duration = +time;
            }
        }
    }
    return duration;
}

exports.timeline = timeline;

return exports;

}({}));

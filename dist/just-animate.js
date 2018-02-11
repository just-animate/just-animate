var JA = (function (exports) {
'use strict';

var globals = {
    useWAAPI: true,
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
function deepClone(input) {
    return JSON.parse(JSON.stringify(input));
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
function isNumber(a) {
    return typeof a === 'number';
}

function isString(a) {
    return typeof a === 'string';
}
function isArrayLike(a) {
    return a && isFinite(a.length) && !isString(a) && !isFunction(a);
}

function isOwner(obj, name) {
    return obj.hasOwnProperty(name);
}

var _ = undefined;

function remove(items, item) {
    var index = items.indexOf(item);
    return index !== -1 ? items.splice(index, 1) : _;
}

function list(indexed) {
    return !isDefined(indexed) ? [] : isArrayLike(indexed) ? indexed : [indexed];
}
function push(indexed, item) {
    if (item !== _) {
        Array.prototype.push.call(indexed, item);
    }
    return item;
}

function mapFlatten(items, mapper) {
    var results = [];
    all(items, function (item) {
        var result = mapper(item);
        if (isArrayLike(result)) {
            all(result, function (item2) { return push(results, item2); });
        }
        else {
            push(results, result);
        }
    });
    return results;
}
function all(items, action) {
    var items2 = list(items);
    for (var i = 0, ilen = items2.length; i < ilen; i++) {
        action(items2[i], i, ilen);
    }
}

var refId = 0;
var objNameExp = /\[object ([a-z]+)\]/i;
function getName(target) {
    var name = target.id || target.name;
    if (!name) {
        name = Object.prototype.toString.call(target);
        var matches = objNameExp.exec(name);
        if (matches) {
            name = matches[1];
        }
    }
    return '@' + name + '_' + ++refId;
}
function assignRef(refs, target) {
    for (var ref in refs) {
        if (refs[ref] === target) {
            return ref;
        }
    }
    var refName = getName(target);
    refs[refName] = target;
    return refName;
}
function replaceWithRefs(refs, target, recurseObjects) {
    if (!isDefined(target) || isString(target) || isNumber(target)) {
        return target;
    }
    if (isArrayLike(target)) {
        return mapFlatten(target, function (t) { return replaceWithRefs(refs, t, recurseObjects); });
    }
    if (isFunction(target)) {
        return assignRef(refs, target);
    }
    if (recurseObjects) {
        for (var name in target) {
            if (isOwner(target, name)) {
                target[name] = replaceWithRefs(refs, target[name], recurseObjects && name !== 'targets');
            }
        }
        return target;
    }
    return assignRef(refs, target);
}

function timeline(options) {
    var self = Object.create(timeline.prototype);
    self.playState = 'idle';
    self._rate = 1;
    self._pos = 0;
    self.E = {};
    self.$ = {};
    self._waapi = isDefined(options.useWAAPI) ? options.useWAAPI : globals.useWAAPI;
    self.mixers = clone(globals.mixers, options.mixers);
    self.refs = clone(globals.refs, options.refs);
    self.labels = clone(globals.labels, options.labels);
    return self;
}
var proto = {
    get duration() {
        return Math.max(calculateDuration(this), this._pos);
    },
    get currentTime() {
        return this._time;
    },
    set currentTime(value) {
        var self = this;
        self._time = value;
    },
    get playbackRate() {
        return this._rate;
    },
    set playbackRate(value) {
        var self = this;
        self._rate = value;
    },
    addSequence: function (animations, at) {
        var self = this;
        if (!isDefined(at)) {
            at = self._pos;
        }
        for (var i = 0; i < animations.length; i++) {
            var a = animations[i];
            a.$at = at;
            at = addSingleKeyframe(self, a.$target, a.$duration, a, 'T');
        }
        keyframesUpdated(self);
        return self;
    },
    addMultiple: function (animations, at) {
        var self = this;
        if (!isDefined(at)) {
            at = self._pos;
        }
        for (var i = 0; i < animations.length; i++) {
            var a = animations[i];
            a.$at = at;
            addSingleKeyframe(self, a.$target, a.$duration, a, 'T');
        }
        keyframesUpdated(self);
        return self;
    },
    addTimeline: function (_t1, _at) {
        return this;
    },
    addLabel: function (labelName) {
        this.labels[labelName] = this._pos;
        return this;
    },
    addDelay: function (time) {
        time > 0 && (this._pos += time);
        return this;
    },
    set: function (target, props, at) {
        var self = this;
        props.$at = at;
        addSingleKeyframe(self, target, 0, props, 'I');
        keyframesUpdated(self);
        return self;
    },
    staggerTo: function (target, duration, props) {
        var self = this;
        addSingleKeyframe(this, target, duration, props, 'S');
        keyframesUpdated(self);
        return self;
    },
    to: function (target, duration, props) {
        var self = this;
        addSingleKeyframe(this, target, duration, props, 'T');
        keyframesUpdated(self);
        return self;
    },
    play: function (_options) {
        return this;
    },
    cancel: function () {
        return this;
    },
    finish: function () {
        return this;
    },
    restart: function () {
        return this.cancel().play();
    },
    reverse: function () {
        this.playbackRate *= -1;
        return this;
    },
    seek: function (time) {
        var self = this;
        var t = resolveLabel(self, time);
        isFinite(t) && (self.currentTime = t);
        return self;
    },
    export: function () {
        return deepClone({
            $: this.$,
            L: this.labels
        });
    },
    import: function (json) {
        var self = this;
        json.L && (self.labels = json.L);
        json.$ && (self.$ = json.$);
        keyframesUpdated(self);
        return self;
    },
    on: function (eventName, callback) {
        var h = this.E;
        var hs = h[eventName] || (h[eventName] = []);
        hs.push(callback);
        return this;
    },
    off: function (eventName, callback) {
        var hs = this.E[eventName];
        if (hs) {
            remove(hs, callback);
        }
        return this;
    }
};
timeline.prototype = proto;
function emit(self, eventName) {
    var hs = self.E[eventName];
    if (hs) {
        hs = hs.slice();
        for (var i = 0; i < hs.length; i++) {
            hs[i]();
        }
    }
}
function resolveTime(self, at, to) {
    return (resolveLabel(self, at) || self._pos) + to;
}
function addSingleKeyframe(self, target, duration, props, type) {
    var selectors = replaceWithRefs(self.refs, list(target), true);
    var selector = selectors.join(',');
    var end = resolveTime(self, props.$at, duration);
    var delay = props.$delay || 0;
    var limit = props.$limit || _;
    var easing = (props.$easing || 'linear');
    for (var key in props) {
        if (key.indexOf('$') !== 0) {
            insertKeyframe(self, selector, key, end, props[key], type, easing, delay, limit);
        }
    }
    updatePosition(self, end);
    return end;
}
function insertKeyframe(self, selector, key, time, nextVal, type, easing, delay, limit) {
    var target = addOrGet(self.$, selector);
    var prop = addOrGet(target, key);
    var event = addOrGet(prop, time + '');
    event.v = nextVal;
    event.c = type;
    easing && (event.e = easing);
    delay && (event.d = delay);
    limit && (event.l = limit);
}
function updatePosition(self, end) {
    self._pos = Math.max(self._pos, end);
}
function keyframesUpdated(self) {
    emit(self, 'config');
    if (self.playState !== 'idle') {
        return;
    }
}
function resolveLabel(self, time) {
    return (isString(time) && self.labels[time]) || +time;
}
function calculateDuration(self) {
    var duration = 0;
    var targets = self.$;
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

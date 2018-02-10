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

function toArray(t) {
    return Array.isArray(t) ? t : [t];
}


function find(indexed, predicate) {
    var ilen = indexed && indexed.length;
    if (!ilen) {
        return _;
    }
    if (predicate === _) {
        return indexed[0];
    }
    for (var i = 0; i < ilen; i++) {
        if (predicate(indexed[i])) {
            return indexed[i];
        }
    }
    return _;
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

function startsWith(source, pattern) {
    return source && source.indexOf(pattern) === 0;
}

function timeline(options) {
    var self = Object.create(timeline.prototype);
    self.playState = 'idle';
    self.duration = 0;
    self.E = {};
    self.$ = [];
    self._waapi = isDefined(options.useWAAPI) ? options.useWAAPI : globals.useWAAPI;
    self.mixers = clone(globals.mixers, options.mixers);
    self.refs = clone(globals.refs, options.refs);
    self.labels = clone(globals.labels, options.labels);
    return self;
}
var proto = {
    addSequence: function (_animations, _at) {
        return this;
    },
    addMultiple: function (_animations, _at) {
        return this;
    },
    addTimeline: function (_t1, _at) {
        return this;
    },
    delay: function (time) {
        this._pos += time;
        return this;
    },
    set: function (target, to, props) {
        var self = this;
        addToKeyframes(self, target, to, props, 'I');
        updatePosition(self);
        return self;
    },
    staggerTo: function (target, to, props) {
        var self = this;
        addToKeyframes(self, target, to, props, 'T');
        updatePosition(self);
        return self;
    },
    to: function (target, to, props) {
        var self = this;
        addToKeyframes(self, target, to, props, 'T');
        updatePosition(self);
        return self;
    },
    reverse: function () {
        return this;
    },
    seek: function (_time) {
        return this;
    },
    play: function (_options) {
        return this;
    },
    restart: function () {
        return this;
    },
    cancel: function () {
        return this;
    },
    finish: function () {
        return this;
    },
    export: function () {
        return {
            $: this.$,
            L: clone(this.labels)
        };
    },
    import: function (json) {
        var self = this;
        json.L && (self.labels = json.L);
        json.$ && (self.$ = json.$);
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
            var index = hs.indexOf(callback);
            if (index !== -1) {
                hs.splice(index, 1);
            }
        }
        return this;
    }
};
timeline.prototype = proto;
function addToKeyframes(self, target, time, props, type) {
    var selector = getTargetSelector(self, target);
    var delay = props.$delay || 0;
    var limit = props.$limit || _;
    var end = (resolveTime(self, props.$at) || self._pos) + resolveTime(self, time);
    var easing = (props.$easing || 'linear');
    for (var key in props) {
        if (!startsWith(key, '$')) {
            var targetJSON = getPropertyJSON(self.$, selector, key);
            var valueJSON = (find(targetJSON.f, function (val) { return val.t === end; }) || push(targetJSON.f, { t: end }));
            valueJSON.e = easing;
            valueJSON.v = props[key];
            valueJSON.c = type;
            valueJSON.d = delay;
            valueJSON.l = limit;
        }
    }
}
function updatePosition(self) {
    self._pos = Math.max.apply(_, mapFlatten(self.$, function (s) { return s.f.map(function (s2) { return s2.t; }); }));
}
function resolveTime(self, time) {
    return (isString(time) && self.labels[time]) || +time;
}
function getTargetSelector(self, targets) {
    return replaceWithRefs(self.refs, toArray(targets), true).join(',');
}
function getPropertyJSON(targets, selector, key) {
    return (find(targets, function (t) { return t.$ === selector && t.k === key; }) ||
        push(targets, {
            $: selector,
            k: key,
            f: []
        }));
}

exports.timeline = timeline;

return exports;

}({}));

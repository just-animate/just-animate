"use strict";
var easings_1 = require('../easings');
var helpers_1 = require('./helpers');
var ElementAnimator = (function () {
    function ElementAnimator(manager, keyframesOrName, el, timings) {
        var _this = this;
        if (!keyframesOrName) {
            return;
        }
        var keyframes;
        if (helpers_1.isString(keyframesOrName)) {
            var definition = manager.findAnimation(keyframesOrName);
            keyframes = definition.keyframes;
            timings = helpers_1.extend({}, definition.timings, timings);
        }
        else {
            keyframes = keyframesOrName;
        }
        if (timings && timings.easing) {
            var easing = easings_1.easings[timings.easing];
            if (easing) {
                timings.easing = easing;
            }
        }
        this.duration = timings.duration;
        var elements = getElements(el);
        this._animators = helpers_1.multiapply(elements, 'animate', [keyframes, timings]);
        if (this._animators.length > 0) {
            this._animators[0].onfinish = function () {
                _this.finish();
            };
        }
    }
    Object.defineProperty(ElementAnimator.prototype, "playbackRate", {
        get: function () {
            var first = helpers_1.head(this._animators);
            return first ? first.playbackRate : 0;
        },
        set: function (val) {
            helpers_1.each(this._animators, function (a) { return a.playbackRate = val; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementAnimator.prototype, "currentTime", {
        get: function () {
            return helpers_1.max(this._animators, 'currentTime') || 0;
        },
        set: function (elapsed) {
            helpers_1.each(this._animators, function (a) { return a.currentTime = elapsed; });
        },
        enumerable: true,
        configurable: true
    });
    ElementAnimator.prototype.finish = function (fn) {
        var _this = this;
        helpers_1.multiapply(this._animators, 'finish', [], fn);
        if (this.playbackRate < 0) {
            helpers_1.each(this._animators, function (a) { return a.currentTime = 0; });
        }
        else {
            helpers_1.each(this._animators, function (a) { return a.currentTime = _this.duration; });
        }
        if (helpers_1.isFunction(this.onfinish)) {
            this.onfinish(this);
        }
        return this;
    };
    ElementAnimator.prototype.play = function (fn) {
        helpers_1.multiapply(this._animators, 'play', [], fn);
        return this;
    };
    ElementAnimator.prototype.pause = function (fn) {
        helpers_1.multiapply(this._animators, 'pause', [], fn);
        return this;
    };
    ElementAnimator.prototype.reverse = function (fn) {
        helpers_1.multiapply(this._animators, 'reverse', [], fn);
        return this;
    };
    ElementAnimator.prototype.cancel = function (fn) {
        helpers_1.multiapply(this._animators, 'cancel', [], fn);
        helpers_1.each(this._animators, function (a) { return a.currentTime = 0; });
        if (helpers_1.isFunction(this.oncancel)) {
            this.oncancel(this);
        }
        return this;
    };
    return ElementAnimator;
}());
exports.ElementAnimator = ElementAnimator;
function getElements(source) {
    if (!source) {
        throw Error('source is undefined');
    }
    if (helpers_1.isString(source)) {
        var nodeResults = document.querySelectorAll(source);
        return helpers_1.toArray(nodeResults);
    }
    if (source instanceof Element) {
        return [source];
    }
    if (helpers_1.isFunction(source)) {
        var provider = source;
        var result = provider();
        return getElements(result);
    }
    if (helpers_1.isArray(source)) {
        var elements_1 = [];
        helpers_1.each(source, function (i) {
            var innerElements = getElements(i);
            elements_1.push.apply(elements_1, innerElements);
        });
        return elements_1;
    }
    return [];
}

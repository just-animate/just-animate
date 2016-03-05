"use strict";
var helpers_1 = require('./helpers');
var AnimationRelay_1 = require('./AnimationRelay');
var AnimationSequence_1 = require('./AnimationSequence');
function getElements(source) {
    if (!source) {
        throw Error('Cannot find elements.  Source is undefined');
    }
    if (source instanceof Element) {
        return [source];
    }
    if (helpers_1.isString(source)) {
        return helpers_1.toArray(document.querySelectorAll(source));
    }
    if (helpers_1.isArray(source) || helpers_1.isJQuery(source)) {
        var elements_1 = [];
        helpers_1.each(source, function (i) {
            elements_1.push.apply(elements_1, getElements(i));
        });
        return elements_1;
    }
    if (helpers_1.isFunction(source)) {
        var provider = source;
        var result = provider();
        return getElements(result);
    }
    return [];
}
var AnimationManager = (function () {
    function AnimationManager() {
        this._definitions = {};
        this._timings = {
            duration: 1000,
            fill: 'both'
        };
    }
    AnimationManager.prototype.animate = function (keyframesOrName, el, timings) {
        if (typeof keyframesOrName === 'undefined') {
            return;
        }
        var keyframes;
        if (helpers_1.isString(keyframesOrName)) {
            var definition = this._definitions[keyframesOrName];
            keyframes = definition.keyframes;
            timings = helpers_1.extend({}, definition.timings, timings);
        }
        else {
            keyframes = keyframesOrName;
        }
        var elements = getElements(el);
        var players = helpers_1.multiapply(elements, 'animate', [keyframes, timings]);
        return new AnimationRelay_1.AnimationRelay(players);
    };
    AnimationManager.prototype.configure = function (timings) {
        helpers_1.extend(this._timings, timings);
        return this;
    };
    AnimationManager.prototype.register = function (name, animationOptions) {
        this._definitions[name] = animationOptions;
        var self = this;
        self[name] = function (el, timings) {
            return self.animate(name, el, timings);
        };
        return self;
    };
    AnimationManager.prototype.sequence = function (steps) {
        var _this = this;
        var animationSteps = helpers_1.map(steps, function (step) {
            if (step.command) {
                return step;
            }
            if (!step.name) {
                return step;
            }
            var definition = _this._definitions[step.name];
            var timings = helpers_1.extend({}, definition.timings);
            if (step.timings) {
                timings = helpers_1.extend(timings, step.timings);
            }
            return {
                el: step.el,
                keyframes: definition.keyframes,
                timings: timings
            };
        });
        return new AnimationSequence_1.AnimationSequence(this, animationSteps);
    };
    return AnimationManager;
}());
exports.AnimationManager = AnimationManager;

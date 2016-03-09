var helpers_1 = require('./helpers');
var AnimationRelay_1 = require('./AnimationRelay');
var AnimationSequence_1 = require('./AnimationSequence');
function getElements(source) {
    if (!source) {
        throw Error('source is undefined');
    }
    if (helpers_1.isString(source)) {
        return helpers_1.toArray(document.querySelectorAll(source));
    }
    if (source instanceof Element) {
        return [source];
    }
    if (helpers_1.isArray(source) || helpers_1.isJQuery(source)) {
        var elements = [];
        helpers_1.each(source, function (i) {
            elements.push.apply(elements, getElements(i));
        });
        return elements;
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
        this._easings = {};
        this._timings = {
            duration: 1000,
            fill: 'both'
        };
    }
    AnimationManager.prototype.animate = function (keyframesOrName, el, timings) {
        if (!keyframesOrName) {
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
        if (timings && timings.easing) {
            var easing = this._easings[timings.easing];
            if (easing) {
                timings.easing = easing;
            }
        }
        var elements = getElements(el);
        var players = helpers_1.multiapply(elements, 'animate', [keyframes, timings]);
        return new AnimationRelay_1.AnimationRelay(players);
    };
    AnimationManager.prototype.configure = function (timings, easings) {
        if (timings) {
            helpers_1.extend(this._timings, timings);
        }
        if (easings) {
            helpers_1.extend(this._easings, easings);
        }
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
})();
exports.AnimationManager = AnimationManager;

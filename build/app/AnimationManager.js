var helpers_1 = require('./helpers');
var AnimationRelay_1 = require('./AnimationRelay');
function getElements(source) {
    if (!source) {
        throw Error("Cannot find elements.  Source is undefined");
    }
    if (source instanceof Element) {
        return [source];
    }
    if (typeof source === 'string') {
        return helpers_1.toArray(document.querySelectorAll(source));
    }
    if (helpers_1.isArray(source) || (typeof jQuery === 'function' && source instanceof jQuery)) {
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
        this._timings = {
            "duration": 1000,
            "fill": "both"
        };
    }
    AnimationManager.prototype.animate = function (name, el, timings) {
        if (typeof name === 'undefined') {
            return;
        }
        var definition = this._definitions[name];
        if (typeof definition === 'undefined') {
            return;
        }
        var timings2 = helpers_1.extend({}, definition.timings);
        if (timings) {
            timings2 = helpers_1.extend(timings2, timings);
        }
        var keyframes = definition.keyframes;
        var elements = getElements(el);
        var players = helpers_1.multiapply(elements, 'animate', [keyframes, timings2]);
        return new AnimationRelay_1.AnimationRelay(players);
    };
    AnimationManager.prototype.configure = function (timings) {
        helpers_1.extend(this._timings, timings);
    };
    AnimationManager.prototype.register = function (name, keyframes, timings) {
        var definition = {
            keyframes: keyframes,
            timings: timings
        };
        this._definitions[name] = definition;
        var self = this;
        this[name] = function (el, timings) {
            return self.animate(name, el, timings);
        };
        return this;
    };
    return AnimationManager;
})();
exports.AnimationManager = AnimationManager;

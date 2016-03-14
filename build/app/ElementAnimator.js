var helpers_1 = require('./helpers');
var ElementAnimator = (function () {
    function ElementAnimator(manager, keyframesOrName, el, timings) {
        if (!keyframesOrName) {
            return;
        }
        var keyframes;
        if (helpers_1.isString(keyframesOrName)) {
            // if keyframes is a string, lookup keyframes from registry
            var definition = manager.findAnimation(keyframesOrName);
            keyframes = definition.keyframes;
            // use registered timings as default, then load timings from params           
            timings = helpers_1.extend({}, definition.timings, timings);
        }
        else {
            // otherwise, keyframes are actually keyframes
            keyframes = keyframesOrName;
        }
        if (timings && timings.easing) {
            // if timings contains an easing property, 
            var easing = manager.findEasing(timings.easing);
            if (easing) {
                timings.easing = easing;
            }
        }
        // get list of elements to animate
        var elements = getElements(el);
        // call .animate on all elements and get a list of their players        
        this._animations = helpers_1.multiapply(elements, 'animate', [keyframes, timings]);
    }
    ElementAnimator.prototype.finish = function (fn) {
        helpers_1.multiapply(this._animations, 'finish', [], fn);
        return this;
    };
    ElementAnimator.prototype.play = function (fn) {
        helpers_1.multiapply(this._animations, 'play', [], fn);
        return this;
    };
    ElementAnimator.prototype.pause = function (fn) {
        helpers_1.multiapply(this._animations, 'pause', [], fn);
        return this;
    };
    ElementAnimator.prototype.reverse = function (fn) {
        helpers_1.multiapply(this._animations, 'reverse', [], fn);
        return this;
    };
    ElementAnimator.prototype.cancel = function (fn) {
        helpers_1.multiapply(this._animations, 'cancel', [], fn);
        return this;
    };
    Object.defineProperty(ElementAnimator.prototype, "onfinish", {
        get: function () {
            if (this._animations.length === 0) {
                return undefined;
            }
            return this._animations[0].onfinish || helpers_1.noop;
        },
        set: function (val) {
            helpers_1.each(this._animations, function (a) { a.onfinish = val; });
        },
        enumerable: true,
        configurable: true
    });
    return ElementAnimator;
})();
exports.ElementAnimator = ElementAnimator;
function getElements(source) {
    if (!source) {
        throw Error('source is undefined');
    }
    if (helpers_1.isString(source)) {
        // if query selector, search for elements 
        var nodeResults = document.querySelectorAll(source);
        return helpers_1.toArray(nodeResults);
    }
    if (source instanceof Element) {
        // if a single element, wrap in array 
        return [source];
    }
    if (helpers_1.isArray(source)) {
        // if array or jQuery object, flatten to an array
        var elements = [];
        helpers_1.each(source, function (i) {
            // recursively call this function in case of nested elements
            var innerElements = getElements(i);
            elements.push.apply(elements, innerElements);
        });
        return elements;
    }
    if (helpers_1.isFunction(source)) {
        // if function, call it and call this function
        var provider = source;
        var result = provider();
        return getElements(result);
    }
    // otherwise return empty    
    return [];
}

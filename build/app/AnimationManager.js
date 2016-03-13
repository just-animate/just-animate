var helpers_1 = require('./helpers');
var AnimationRelay_1 = require('./AnimationRelay');
var AnimationSequence_1 = require('./AnimationSequence');
var AnimationSheet_1 = require('./AnimationSheet');
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
    if (helpers_1.isArray(source) || helpers_1.isJQuery(source)) {
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
var AnimationManager = (function () {
    function AnimationManager() {
        this._registry = {};
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
            // if keyframes is a string, lookup keyframes from registry
            var definition = this._registry[keyframesOrName];
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
            var easing = this._easings[timings.easing];
            if (easing) {
                timings.easing = easing;
            }
        }
        // get list of elements to animate
        var elements = getElements(el);
        // call .animate on all elements and get a list of their players        
        var players = helpers_1.multiapply(elements, 'animate', [keyframes, timings]);
        // return an animation relay for all players       
        return new AnimationRelay_1.AnimationRelay(players);
    };
    AnimationManager.prototype.animateSequence = function (options) {
        var _this = this;
        var animationSteps = helpers_1.map(options.steps, function (step) {
            if (step.command || !step.name) {
                return step;
            }
            var definition = _this._registry[step.name];
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
        var sequence = new AnimationSequence_1.AnimationSequence(this, animationSteps);
        if (options.autoplay === true) {
            sequence.play();
        }
        return sequence;
    };
    AnimationManager.prototype.animateSheet = function (options) {
        var _this = this;
        var sheetDuration = options.duration;
        if (sheetDuration === undefined) {
            throw Error('Duration is required');
        }
        var animationEvents = helpers_1.map(options.events, function (evt) {
            var keyframes;
            var timings;
            var el;
            if (evt.name) {
                var definition = _this._registry[evt.name];
                var timings2 = helpers_1.extend({}, definition.timings);
                if (evt.timings) {
                    timings = helpers_1.extend(timings, evt.timings);
                }
                keyframes = definition.keyframes;
                timings = timings2;
                el = evt.el;
            }
            else {
                keyframes = evt.keyframes;
                timings = evt.timings;
                el = evt.el;
            }
            // calculate endtime
            var startTime = sheetDuration * evt.offset;
            var endTime = startTime + timings.duration;
            var isClipped = endTime > sheetDuration;
            // if end of animation is clipped, set endTime to duration            
            if (isClipped) {
                endTime = sheetDuration;
            }
            return {
                keyframes: keyframes,
                timings: timings,
                el: el,
                offset: evt.offset,
                _isClipped: isClipped,
                _startTimeMs: startTime,
                _endTimeMs: endTime
            };
        });
        var sheet = new AnimationSheet_1.AnimationSheet({
            autoplay: options.autoplay,
            duration: options.duration,
            events: animationEvents
        });
        return sheet;
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
        this._registry[name] = animationOptions;
        var self = this;
        self[name] = function (el, timings) {
            return self.animate(name, el, timings);
        };
        return self;
    };
    return AnimationManager;
})();
exports.AnimationManager = AnimationManager;

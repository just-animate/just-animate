var helpers_1 = require('./helpers');
var ElementAnimator_1 = require('./ElementAnimator');
var SequenceAnimator_1 = require('./SequenceAnimator');
var TimelineAnimator_1 = require('./TimelineAnimator');
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
        return new ElementAnimator_1.ElementAnimator(this, keyframesOrName, el, timings);
    };
    AnimationManager.prototype.animateSequence = function (options) {
        return new SequenceAnimator_1.SequenceAnimator(this, options);
    };
    AnimationManager.prototype.animateSheet = function (options) {
        return new TimelineAnimator_1.TimelineAnimator(this, options);
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
    AnimationManager.prototype.findAnimation = function (name) {
        return this._registry[name] || undefined;
    };
    AnimationManager.prototype.findEasing = function (name) {
        return this._easings[name] || undefined;
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

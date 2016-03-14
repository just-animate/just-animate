var helpers_1 = require('./helpers');
var SequenceAnimator = (function () {
    function SequenceAnimator(manager, options) {
        var steps = helpers_1.map(options.steps, function (step) {
            if (step.command || !step.name) {
                return step;
            }
            var definition = manager.findAnimation(step.name);
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
        this.onfinish = helpers_1.noop;
        this._currentIndex = -1;
        this._isReversed = false;
        this._manager = manager;
        this._steps = steps;
        if (options.autoplay === true) {
            this.play();
        }
    }
    SequenceAnimator.prototype.finish = function (fn) {
        this._errorCallback = fn;
        this._currentIndex = this._isReversed ? this._steps.length : -1;
        for (var x = 0; x < this._steps.length; x++) {
            var step = this._steps[x];
            if (step._animator !== undefined) {
                step._animator.cancel(fn);
            }
        }
        this.onfinish(undefined);
        return this;
    };
    SequenceAnimator.prototype.play = function (fn) {
        this._errorCallback = fn;
        this._isReversed = false;
        this._playThisStep();
        return this;
    };
    SequenceAnimator.prototype.pause = function (fn) {
        this._errorCallback = fn;
        // ignore pause if not relevant
        if (!this._isInEffect()) {
            return this;
        }
        var animator = this._getAnimator();
        animator.pause(fn);
        return this;
    };
    SequenceAnimator.prototype.reverse = function (fn) {
        this._errorCallback = fn;
        this._isReversed = true;
        this._playThisStep();
        return this;
    };
    SequenceAnimator.prototype.cancel = function (fn) {
        this._errorCallback = fn;
        this._isReversed = false;
        this._currentIndex = -1;
        for (var x = 0; x < this._steps.length; x++) {
            var step = this._steps[x];
            if (step._animator !== undefined) {
                step._animator.cancel(fn);
            }
        }
        return this;
    };
    SequenceAnimator.prototype._isInEffect = function () {
        return this._currentIndex > -1 && this._currentIndex < this._steps.length;
    };
    SequenceAnimator.prototype._getAnimator = function () {
        var it = this._steps[this._currentIndex];
        if (it._animator) {
            return it._animator;
        }
        it._animator = this._manager.animate(it.keyframes, it.el, it.timings);
        return it._animator;
    };
    SequenceAnimator.prototype._playNextStep = function (evt) {
        if (this._isReversed) {
            this._currentIndex--;
        }
        else {
            this._currentIndex++;
        }
        if (this._isInEffect()) {
            this._playThisStep();
        }
        else {
            this.onfinish(evt);
        }
    };
    SequenceAnimator.prototype._playThisStep = function () {
        var _this = this;
        if (!this._isInEffect()) {
            this._currentIndex = this._isReversed ? this._steps.length - 1 : 0;
        }
        var animator = this._getAnimator();
        animator.onfinish = function (evt) {
            _this._playNextStep(evt);
        };
        animator.play(this._errorCallback);
    };
    return SequenceAnimator;
})();
exports.SequenceAnimator = SequenceAnimator;

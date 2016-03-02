var helpers_1 = require('./helpers');
var AnimationSequence = (function () {
    function AnimationSequence(manager, steps) {
        this.isReversed = false;
        this.manager = manager;
        this.steps = steps;
        this.currentIndex = -1;
        this.onfinish = helpers_1.noop;
    }
    AnimationSequence.prototype.isActive = function () {
        return this.currentIndex > -1 && this.currentIndex < this.steps.length;
    };
    AnimationSequence.prototype.getAnimator = function () {
        var it = this.steps[this.currentIndex];
        if (it._animator) {
            return it._animator;
        }
        it._animator = this.manager.animate(it.keyframes, it.el, it.timings);
        return it._animator;
    };
    AnimationSequence.prototype.playNextStep = function (evt) {
        if (this.isReversed) {
            this.currentIndex--;
        }
        else {
            this.currentIndex++;
        }
        if (this.isActive()) {
            this.playThisStep();
        }
        else {
            this.onfinish(evt);
        }
    };
    AnimationSequence.prototype.playThisStep = function () {
        var _this = this;
        if (!this.isActive()) {
            this.currentIndex = this.isReversed ? this.steps.length - 1 : 0;
        }
        var animator = this.getAnimator();
        animator.onfinish = function (evt) {
            _this.playNextStep(evt);
        };
        animator.play(this.errorCallback);
    };
    AnimationSequence.prototype.finish = function (fn) {
        this.currentIndex = this.isReversed ? this.steps.length : -1;
        for (var x = 0; x < this.steps.length; x++) {
            var step = this.steps[x];
            if (step._animator !== undefined) {
                step._animator.cancel(fn);
            }
        }
        this.onfinish(undefined);
        return this;
    };
    AnimationSequence.prototype.play = function (fn) {
        this.isReversed = false;
        this.playThisStep();
        return this;
    };
    AnimationSequence.prototype.pause = function (fn) {
        // ignore pause if not relevant
        if (!this.isActive()) {
            return this;
        }
        var animator = this.getAnimator();
        animator.pause(fn);
        return this;
    };
    AnimationSequence.prototype.reverse = function (fn) {
        this.isReversed = true;
        this.playThisStep();
        return this;
    };
    AnimationSequence.prototype.cancel = function (fn) {
        this.isReversed = false;
        this.currentIndex = -1;
        for (var x = 0; x < this.steps.length; x++) {
            var step = this.steps[x];
            if (step._animator !== undefined) {
                step._animator.cancel(fn);
            }
        }
        return this;
    };
    return AnimationSequence;
})();
exports.AnimationSequence = AnimationSequence;

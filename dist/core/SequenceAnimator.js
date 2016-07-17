"use strict";
var objects_1 = require('../helpers/objects');
var lists_1 = require('../helpers/lists');
var type_1 = require('../helpers/type');
/**
 * (description)
 *
 * @export
 * @class SequenceAnimator
 * @implements {ja.IAnimator}
 */
var SequenceAnimator = (function () {
    /**
     * Creates an instance of SequenceAnimator.
     *
     * @param {ja.IAnimationManager} manager (description)
     * @param {ja.ISequenceOptions} options (description)
     */
    function SequenceAnimator(manager, options) {
        /**
         * (description)
         *
         * @param {ja.ISequenceEvent} step (description)
         * @returns (description)
         */
        var steps = lists_1.map(options.steps, function (step) {
            if (step.command || !step.name) {
                return step;
            }
            var definition = manager.findAnimation(step.name);
            var timings = objects_1.extend({}, definition.timings);
            if (step.timings) {
                timings = objects_1.extend(timings, step.timings);
            }
            return {
                el: step.el,
                keyframes: definition.keyframes,
                timings: definition.timings
            };
        });
        this.onfinish = lists_1.noop;
        this._currentIndex = -1;
        this._manager = manager;
        this._steps = steps;
        if (options.autoplay === true) {
            this.play();
        }
    }
    Object.defineProperty(SequenceAnimator.prototype, "currentTime", {
        /**
         * (description)
         *
         * @readonly
         * @type {number}
         */
        get: function () {
            var currentIndex = this._currentIndex;
            var len = this._steps.length;
            if (currentIndex === -1 || currentIndex === len) {
                return 0;
            }
            var isReversed = this.playbackRate === -1;
            var beforeTime = 0;
            var afterTime = 0;
            var currentTime;
            for (var i = 0; i < len; i++) {
                var step = this._steps[i];
                if (i < currentIndex) {
                    beforeTime += step.timings.duration;
                    continue;
                }
                if (i > currentIndex) {
                    afterTime += step.timings.duration;
                    continue;
                }
                if (isReversed) {
                    currentTime = this.duration - step.animator.currentTime;
                    continue;
                }
                currentTime = step.animator.currentTime;
            }
            return currentTime + (isReversed ? afterTime : beforeTime);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SequenceAnimator.prototype, "duration", {
        /**
         * (description)
         *
         * @readonly
         * @type {number}
         */
        get: function () {
            return this._steps.reduce(function (c, n) { return c + (n.timings.duration || 0); }, 0);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * (description)
     *
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    SequenceAnimator.prototype.finish = function (fn) {
        this._errorCallback = fn;
        this._currentIndex = -1;
        for (var x = 0; x < this._steps.length; x++) {
            var step = this._steps[x];
            if (step.animator !== undefined) {
                step.animator.cancel(fn);
            }
        }
        if (type_1.isFunction(this.onfinish)) {
            this.onfinish(this);
        }
        return this;
    };
    /**
     * (description)
     *
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    SequenceAnimator.prototype.play = function (fn) {
        this._errorCallback = fn;
        this.playbackRate = 1;
        this._playThisStep();
        return this;
    };
    /**
     * (description)
     *
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
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
    /**
     * (description)
     *
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    SequenceAnimator.prototype.reverse = function (fn) {
        this._errorCallback = fn;
        this.playbackRate = -1;
        this._playThisStep();
        return this;
    };
    /**
     * (description)
     *
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    SequenceAnimator.prototype.cancel = function (fn) {
        this._errorCallback = fn;
        this.playbackRate = undefined;
        this._currentIndex = -1;
        for (var x = 0; x < this._steps.length; x++) {
            var step = this._steps[x];
            if (step.animator !== undefined) {
                step.animator.cancel(fn);
            }
        }
        if (type_1.isFunction(this.oncancel)) {
            this.oncancel(this);
        }
        return this;
    };
    SequenceAnimator.prototype._isInEffect = function () {
        return this._currentIndex > -1 && this._currentIndex < this._steps.length;
    };
    SequenceAnimator.prototype._getAnimator = function () {
        var it = this._steps[this._currentIndex];
        if (it.animator) {
            return it.animator;
        }
        it.animator = this._manager.animate(it.keyframes, it.el, it.timings);
        return it.animator;
    };
    SequenceAnimator.prototype._playNextStep = function (evt) {
        if (this.playbackRate === -1) {
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
            if (this.playbackRate === -1) {
                this._currentIndex = this._steps.length - 1;
            }
            else {
                this._currentIndex = 0;
            }
        }
        var animator = this._getAnimator();
        animator.onfinish = function (evt) {
            _this._playNextStep(evt);
        };
        animator.play(this._errorCallback);
    };
    return SequenceAnimator;
}());
exports.SequenceAnimator = SequenceAnimator;

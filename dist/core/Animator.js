"use strict";
var lists_1 = require('../helpers/lists');
var Dispatcher_1 = require('./Dispatcher');
var Animator = (function () {
    function Animator(effects) {
        this._effects = undefined;
        this._dispatcher = new Dispatcher_1.Dispatcher();
        this._effects = effects;
    }
    Object.defineProperty(Animator.prototype, "duration", {
        get: function () {
            var first = lists_1.head(this._effects);
            return first ? first.duration : undefined;
        },
        set: function (val) {
            lists_1.each(this._effects, function (a) { return a.duration = val; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "currentTime", {
        get: function () {
            var first = lists_1.head(this._effects);
            return first ? first.currentTime : undefined;
        },
        set: function (val) {
            lists_1.each(this._effects, function (a) { return a.currentTime = val; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "playbackRate", {
        get: function () {
            var first = lists_1.head(this._effects);
            return first ? first.playbackRate : undefined;
        },
        set: function (val) {
            lists_1.each(this._effects, function (a) { return a.playbackRate = val; });
        },
        enumerable: true,
        configurable: true
    });
    Animator.prototype.addEventListener = function (eventName, listener) {
        this._dispatcher.on(eventName, listener);
    };
    Animator.prototype.removeEventListener = function (eventName, listener) {
        this._dispatcher.off(eventName, listener);
    };
    /**
     * (description)
     *
     * @param {ICallbackHandler} [fn] (description)
     * @returns {IAnimator} (description)
     */
    Animator.prototype.cancel = function () {
        lists_1.each(this._effects, function (a) {
            a.cancel();
            a.currentTime = 0;
        });
        this._dispatcher.trigger('cancel');
    };
    /**
     * (description)
     *
     * @param {ICallbackHandler} [fn] (description)
     * @returns {IAnimator} (description)
     */
    Animator.prototype.finish = function () {
        var newTime = this.playbackRate < 0 ? 0 : this.duration;
        lists_1.each(this._effects, function (e) {
            e.finish();
            e.currentTime = newTime;
        });
        this._dispatcher.trigger('finish');
    };
    /**
     * (description)
     *
     * @param {ICallbackHandler} [fn] (description)
     * @returns {IAnimator} (description)
     */
    Animator.prototype.play = function () {
        lists_1.each(this._effects, function (e) { return e.play(); });
    };
    /**
     * (description)
     *
     * @param {ICallbackHandler} [fn] (description)
     * @returns {IAnimator} (description)
     */
    Animator.prototype.pause = function () {
        lists_1.each(this._effects, function (e) { return e.pause(); });
    };
    /**
     * (description)
     *
     * @param {ICallbackHandler} [fn] (description)
     * @returns {IAnimator} (description)
     */
    Animator.prototype.reverse = function () {
        lists_1.each(this._effects, function (e) { return e.reverse(); });
    };
    return Animator;
}());
exports.Animator = Animator;

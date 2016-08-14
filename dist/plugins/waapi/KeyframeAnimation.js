"use strict";
var resources_1 = require('../../common/resources');
var Dispatcher_1 = require('../core/Dispatcher');
var KeyframeAnimator = (function () {
    function KeyframeAnimator(target, keyframes, timings) {
        var delay = timings.delay || 0;
        var endDelay = timings.endDelay || 0;
        var iterations = timings.iterations || 1;
        var duration = timings.duration || 0;
        var dispatcher = Dispatcher_1.Dispatcher();
        var self = this;
        self._totalTime = delay + ((iterations || 1) * duration) + endDelay;
        self._dispatcher = dispatcher;
        var animator = target[resources_1.animate](keyframes, timings);
        // immediately cancel to prevent effects until play is called    
        animator.cancel();
        animator.onfinish = function () { return dispatcher.trigger(resources_1.finish); };
        self._animator = animator;
    }
    KeyframeAnimator.prototype.totalDuration = function () {
        return this._totalTime;
    };
    KeyframeAnimator.prototype.seek = function (value) {
        var self = this;
        self._animator.currentTime = value;
    };
    KeyframeAnimator.prototype.playbackRate = function (value) {
        var self = this;
        self._animator.playbackRate = value;
    };
    KeyframeAnimator.prototype.playState = function () {
        return this._animator.playState;
    };
    KeyframeAnimator.prototype.off = function (eventName, listener) {
        this._dispatcher.off(eventName, listener);
    };
    KeyframeAnimator.prototype.on = function (eventName, listener) {
        this._dispatcher.on(eventName, listener);
    };
    KeyframeAnimator.prototype.cancel = function () {
        var self = this;
        self._animator.cancel();
        self._dispatcher.trigger(resources_1.cancel);
    };
    KeyframeAnimator.prototype.reverse = function () {
        var self = this;
        self._animator.reverse();
        self._dispatcher.trigger(resources_1.reverse);
    };
    KeyframeAnimator.prototype.pause = function () {
        var self = this;
        self._animator.pause();
        self._dispatcher.trigger(resources_1.pause);
    };
    KeyframeAnimator.prototype.play = function () {
        var self = this;
        self._animator.play();
        self._dispatcher.trigger(resources_1.play);
    };
    KeyframeAnimator.prototype.finish = function () {
        var self = this;
        self._animator.finish();
    };
    return KeyframeAnimator;
}());
exports.KeyframeAnimator = KeyframeAnimator;

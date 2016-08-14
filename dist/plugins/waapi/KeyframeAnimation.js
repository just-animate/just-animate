"use strict";
var resources_1 = require('../../common/resources');
var KeyframeAnimator = (function () {
    function KeyframeAnimator(target, keyframes, timings) {
        var delay = timings.delay || 0;
        var endDelay = timings.endDelay || 0;
        var iterations = timings.iterations || 1;
        var duration = timings.duration || 0;
        var self = this;
        self._totalTime = delay + ((iterations || 1) * duration) + endDelay;
        var animator = target[resources_1.animate](keyframes, timings);
        // immediately cancel to prevent effects until play is called    
        animator.cancel();
        self._animator = animator;
    }
    KeyframeAnimator.prototype.totalDuration = function () {
        return this._totalTime;
    };
    KeyframeAnimator.prototype.seek = function (value) {
        this._animator.currentTime = value;
    };
    KeyframeAnimator.prototype.playbackRate = function (value) {
        this._animator.playbackRate = value;
    };
    KeyframeAnimator.prototype.reverse = function () {
        this._animator.playbackRate *= -1;
    };
    KeyframeAnimator.prototype.playState = function (value) {
        var self = this;
        var animator = self._animator;
        var playState = animator.playState;
        if (value === resources_1.nil) {
            return playState;
        }
        if (value === 'finished') {
            animator.finish();
            return;
        }
        if (value === 'idle') {
            animator.cancel();
            return;
        }
        if (value === 'paused') {
            animator.pause();
            return;
        }
        if (value === 'running') {
            animator.play();
            return;
        }
    };
    return KeyframeAnimator;
}());
exports.KeyframeAnimator = KeyframeAnimator;

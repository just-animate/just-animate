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
        if (value === resources_1.finished) {
            animator.finish();
        }
        else if (value === resources_1.idle) {
            animator.cancel();
        }
        else if (value === resources_1.paused) {
            animator.pause();
        }
        else if (value === resources_1.running) {
            animator.play();
        }
    };
    KeyframeAnimator.prototype.onupdate = function (context) { };
    return KeyframeAnimator;
}());
exports.KeyframeAnimator = KeyframeAnimator;

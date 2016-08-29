"use strict";
var resources_1 = require('../../common/resources');
var KeyframeAnimator = (function () {
    function KeyframeAnimator(init) {
        this._init = init;
    }
    KeyframeAnimator.prototype.seek = function (value) {
        this._ensureInit();
        if (this._animator.currentTime !== value) {
            this._animator.currentTime = value;
        }
    };
    KeyframeAnimator.prototype.playbackRate = function (value) {
        this._ensureInit();
        if (this._animator.playbackRate !== value) {
            this._animator.playbackRate = value;
        }
    };
    KeyframeAnimator.prototype.reverse = function () {
        this._ensureInit();
        this._animator.playbackRate *= -1;
    };
    KeyframeAnimator.prototype.playState = function (value) {
        var self = this;
        self._ensureInit();
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
    KeyframeAnimator.prototype._ensureInit = function () {
        if (this._init) {
            this._animator = this._init();
            this._init = resources_1.nil;
        }
    };
    return KeyframeAnimator;
}());
exports.KeyframeAnimator = KeyframeAnimator;

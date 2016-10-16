"use strict";
var resources_1 = require("../../common/resources");
var KeyframeAnimator = (function () {
    function KeyframeAnimator(init) {
        this._init = init;
        this._initialized = resources_1.nil;
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
    KeyframeAnimator.prototype.restart = function () {
        var animator = this._animator;
        animator.cancel();
        animator.play();
    };
    KeyframeAnimator.prototype.playState = function (value) {
        var self = this;
        self._ensureInit();
        var animator = self._animator;
        var playState = !animator || self._initialized === false ? 'fatal' : animator.playState;
        if (value === resources_1.nil) {
            return playState;
        }
        if (playState === 'fatal') {
        }
        else if (value === resources_1.finished) {
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
        var self = this;
        if (this._init) {
            var init = self._init;
            self._init = resources_1.nil;
            self._initialized = false;
            self._animator = init();
            self._initialized = true;
        }
    };
    return KeyframeAnimator;
}());
exports.KeyframeAnimator = KeyframeAnimator;

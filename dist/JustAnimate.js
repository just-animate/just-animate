"use strict";
var lists_1 = require("./common/lists");
var Animator_1 = require("./plugins/core/Animator");
var TimeLoop_1 = require("./plugins/core/TimeLoop");
var MixinService_1 = require("./plugins/core/MixinService");
var JustAnimate = (function () {
    function JustAnimate() {
        this.easings = {
            ease: 'ease',
            easeIn: 'easeIn',
            easeInBack: 'easeInBack',
            easeInCirc: 'easeInCirc',
            easeInCubic: 'easeInCubic',
            easeInExpo: 'easeInExpo',
            easeInOut: 'easeInOut',
            easeInOutBack: 'easeInOutBack',
            easeInOutCirc: 'easeInOutCirc',
            easeInOutCubic: 'easeInOutCubic',
            easeInOutExpo: 'easeInOutExpo',
            easeInOutQuad: 'easeInOutQuad',
            easeInOutQuart: 'easeInOutQuart',
            easeInOutQuint: 'easeInOutQuint',
            easeInOutSine: 'easeInOutSine',
            easeInQuad: 'easeInQuad',
            easeInQuart: 'easeInQuart',
            easeInQuint: 'easeInQuint',
            easeInSine: 'easeInSine',
            easeOut: 'easeOut',
            easeOutBack: 'easeOutBack',
            easeOutCirc: 'easeOutCirc',
            easeOutCubic: 'easeOutCubic',
            easeOutExpo: 'easeOutExpo',
            easeOutQuad: 'easeOutQuad',
            easeOutQuart: 'easeOutQuart',
            easeOutQuint: 'easeOutQuint',
            easeOutSine: 'easeOutSine',
            elegantSlowStartEnd: 'elegantSlowStartEnd',
            linear: 'linear',
            stepEnd: 'stepEnd',
            stepStart: 'stepStart'
        };
        var self = this;
        self._resolver = new MixinService_1.MixinService();
        self._timeLoop = TimeLoop_1.TimeLoop();
        self.plugins = [];
    }
    JustAnimate.inject = function (animations) {
        var resolver = new MixinService_1.MixinService();
        lists_1.each(animations, function (a) { return resolver.registerAnimation(a, true); });
    };
    JustAnimate.prototype.animate = function (options) {
        return new Animator_1.Animator(this._resolver, this._timeLoop, this.plugins).animate(options);
    };
    JustAnimate.prototype.register = function (preset) {
        this._resolver.registerAnimation(preset, false);
    };
    JustAnimate.prototype.inject = function (animations) {
        var resolver = this._resolver;
        lists_1.each(animations, function (a) { return resolver.registerAnimation(a, true); });
    };
    return JustAnimate;
}());
exports.JustAnimate = JustAnimate;

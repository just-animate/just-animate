"use strict";
var lists_1 = require("./common/lists");
var Animator_1 = require("./plugins/core/Animator");
var TimeLoop_1 = require("./plugins/core/TimeLoop");
var MixinService_1 = require("./plugins/core/MixinService");
var JustAnimate = (function () {
    function JustAnimate() {
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

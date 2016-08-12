"use strict";
var lists_1 = require('./common/lists');
var resources_1 = require('./common/resources');
var Animator_1 = require('./plugins/core/Animator');
var TimeLoop_1 = require('./plugins/core/TimeLoop');
var MixinService_1 = require('./plugins/core/MixinService');
function JustAnimate() {
    var self = this;
    self = self instanceof JustAnimate ? self : Object.create(JustAnimate.prototype);
    self._registry = {};
    self._resolver = new MixinService_1.MixinService();
    self._timeLoop = TimeLoop_1.TimeLoop();
    return self;
}
exports.JustAnimate = JustAnimate;
JustAnimate.inject = inject;
JustAnimate.prototype = {
    _resolver: resources_1.nil,
    _timeLoop: resources_1.nil,
    animate: function (options) {
        var animator = Animator_1.Animator(this._resolver, this._timeLoop);
        animator.animate(options);
        return animator;
    },
    register: function (preset) {
        this._resolver.registerAnimation(preset, false);
    },
    inject: inject
};
function inject(animations) {
    var resolver = new MixinService_1.MixinService();
    lists_1.each(animations, function (a) { return resolver.registerAnimation(a, true); });
}

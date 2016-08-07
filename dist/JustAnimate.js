"use strict";
var lists_1 = require('./helpers/lists');
var Animator_1 = require('./core/Animator');
var TimeLoop_1 = require('./core/TimeLoop');
var resources_1 = require('./helpers/resources');
var AnimationResolver_1 = require('./core/AnimationResolver');
function JustAnimate() {
    var self = this;
    self = self instanceof JustAnimate ? self : Object.create(JustAnimate.prototype);
    self._registry = {};
    self._resolver = AnimationResolver_1.AnimationResolver();
    self._timeLoop = TimeLoop_1.TimeLoop();
    return self;
}
exports.JustAnimate = JustAnimate;
JustAnimate.inject = inject;
JustAnimate.prototype = {
    _resolver: resources_1.nothing,
    _timeLoop: resources_1.nothing,
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
    var resolver = AnimationResolver_1.AnimationResolver();
    lists_1.each(animations, function (a) { return resolver.registerAnimation(a, true); });
}

"use strict";
var KeyframeAnimator_1 = require("../waapi/KeyframeAnimator");
var units_1 = require("../../common/units");
var easings_1 = require("../core/easings");
var objects_1 = require("../../common/objects");
var resources_1 = require("../../common/resources");
var KeyframeTransformers_1 = require("./KeyframeTransformers");
var KeyframePlugin = (function () {
    function KeyframePlugin() {
    }
    KeyframePlugin.prototype.canHandle = function (options) {
        return !!(options.css);
    };
    KeyframePlugin.prototype.handle = function (ctx) {
        var options = ctx.options;
        var delay = units_1.createUnitResolver(objects_1.resolve(options.delay, ctx) || 0)(ctx.index);
        var endDelay = units_1.createUnitResolver(objects_1.resolve(options.endDelay, ctx) || 0)(ctx.index);
        var iterations = objects_1.resolve(options.iterations, ctx) || 1;
        var iterationStart = objects_1.resolve(options.iterationStart, ctx) || 0;
        var direction = objects_1.resolve(options.direction, ctx) || resources_1.nil;
        var duration = options.to - options.from;
        var fill = objects_1.resolve(options.fill, ctx) || 'none';
        var totalTime = delay + ((iterations || 1) * duration) + endDelay;
        // note: don't unwrap easings so we don't break this later with custom easings
        var easing = easings_1.getEasingString(options.easing);
        var timings = {
            delay: delay,
            endDelay: endDelay,
            duration: duration,
            iterations: iterations,
            iterationStart: iterationStart,
            fill: fill,
            direction: direction,
            easing: easing
        };
        var animator = new KeyframeAnimator_1.KeyframeAnimator(KeyframeTransformers_1.initAnimator.bind(resources_1.nada, timings, ctx));
        animator.totalDuration = totalTime;
        return animator;
    };
    return KeyframePlugin;
}());
exports.KeyframePlugin = KeyframePlugin;

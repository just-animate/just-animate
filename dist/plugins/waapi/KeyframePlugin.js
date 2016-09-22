"use strict";
var elements_1 = require('../../common/elements');
var KeyframeTransformers_1 = require('./KeyframeTransformers');
var KeyframePlugin = (function () {
    function KeyframePlugin() {
    }
    KeyframePlugin.prototype.canHandle = function (options) {
        return !!(options.css);
    };
    KeyframePlugin.prototype.handle = function (options) {
        var targets = elements_1.queryElements(options.targets);
        var animators = [];
        for (var i = 0, len = targets.length; i < len; i++) {
            animators.push(KeyframeTransformers_1.createAnimator({
                index: i,
                options: options,
                target: targets[i],
                targets: targets
            }));
        }
        return animators;
    };
    return KeyframePlugin;
}());
exports.KeyframePlugin = KeyframePlugin;

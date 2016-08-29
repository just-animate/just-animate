"use strict";
var elements_1 = require('../../common/elements');
// todo: remove these imports as soon as possible
var KeyframeTransformers_1 = require('./KeyframeTransformers');
var KeyframePlugin = (function () {
    function KeyframePlugin() {
    }
    KeyframePlugin.prototype.canHandle = function (options) {
        return !!(options.css);
    };
    KeyframePlugin.prototype.handle = function (options) {
        return elements_1.queryElements(options.targets)
            .map(function (target) { return KeyframeTransformers_1.createAnimator(target, options); });
    };
    return KeyframePlugin;
}());
exports.KeyframePlugin = KeyframePlugin;

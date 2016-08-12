"use strict";
var resources_1 = require('../../common/resources');
var presets = {};
exports.MixinService = (function () {
    function class_1() {
        this.defs = {};
    }
    class_1.prototype.findAnimation = function (name) {
        return this.defs[name] || presets[name] || resources_1.nil;
    };
    class_1.prototype.registerAnimation = function (animationOptions, isGlobal) {
        var name = animationOptions.name;
        if (isGlobal) {
            presets[name] = animationOptions;
            return;
        }
        this.defs[name] = animationOptions;
    };
    return class_1;
}());

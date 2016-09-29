"use strict";
var resources_1 = require("../../common/resources");
var presets = {};
var MixinService = (function () {
    function MixinService() {
        this.defs = {};
    }
    MixinService.prototype.findAnimation = function (name) {
        return this.defs[name] || presets[name] || resources_1.nil;
    };
    MixinService.prototype.registerAnimation = function (animationOptions, isGlobal) {
        var name = animationOptions.name;
        if (isGlobal) {
            presets[name] = animationOptions;
            return;
        }
        this.defs[name] = animationOptions;
    };
    return MixinService;
}());
exports.MixinService = MixinService;

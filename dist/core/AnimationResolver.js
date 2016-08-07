"use strict";
var resources_1 = require('../helpers/resources');
function AnimationResolver() {
    var self = this instanceof AnimationResolver ? this : Object.create(AnimationResolver.prototype);
    self.defs = {};
    return self;
}
exports.AnimationResolver = AnimationResolver;
var animations = {};
AnimationResolver.prototype = {
    defs: resources_1.nothing,
    findAnimation: function (name) {
        return this.defs[name] || animations[name] || resources_1.nothing;
    },
    registerAnimation: function (animationOptions, isGlobal) {
        if (isGlobal) {
            animations[animationOptions.name] = animationOptions;
            return;
        }
        this.defs[animationOptions.name] = animationOptions;
    }
};

"use strict";
var AnimationManager_1 = require('./app/AnimationManager');
var animations = require('./animations/_all');
var animationManager = new AnimationManager_1.AnimationManager();
for (var animationName in animations) {
    if (animations.hasOwnProperty(animationName)) {
        var animationOptions = animations[animationName];
        animationManager.register(animationName, animationOptions);
    }
}
window['Just'] = animationManager;

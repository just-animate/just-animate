var easings = require('./animations/easings.json');
var AnimationManager_1 = require('./app/AnimationManager');
var animations = require('./animations/_all');
angular.module('just.animate', [])
    .service('just', function () {
    var animationManager = new AnimationManager_1.AnimationManager();
    animationManager.configure(undefined, easings);
    for (var animationName in animations) {
        if (animations.hasOwnProperty(animationName)) {
            var animationOptions = animations[animationName];
            animationManager.register(animationName, animationOptions);
        }
    }
    return animationManager;
});

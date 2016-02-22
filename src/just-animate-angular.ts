declare var angular;

import {AnimationManager} from './app/AnimationManager';
import * as animations from './animations/_all';

angular.module('just.animate', [])
  .service('just', function() {
    var animationManager = new AnimationManager();

    for (var animationName in animations) {
      var a = animations[animationName];
      animationManager.register(animationName, a.keyframes, a.timings)
    }
    
    return animationManager;
  });
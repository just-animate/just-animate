declare var jQuery;

import {AnimationManager} from './app/AnimationManager';
import * as animations from './animations/_all';

var animationManager = new AnimationManager();

for (var animationName in animations) {
  var a = animations[animationName];
  animationManager.register(animationName, a.keyframes, a.timings)
}

window['Just'] = animationManager;

(function($) {
  $.fn.justAnimate = function(name: string, timings?: any) {
    animationManager.animate(name, this, timings);
    return this;
    };
  $.just = animationManager;  
} (jQuery));
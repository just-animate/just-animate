declare const angular;

import {AnimationManager} from './app/AnimationManager';
import * as animations from './animations/_all';

angular.module('just.animate', [])
    .service('just', function() {
        const animationManager = new AnimationManager();

        for (let animationName in animations) {
            const animationOptions = animations[animationName];
            animationManager.register(animationName, animationOptions)
        }

        return animationManager;
    });
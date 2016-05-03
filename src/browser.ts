declare var window: any;
declare var angular: any;

import {AnimationManager} from './AnimationManager';
import {IAnimationOptions} from './interfaces/IAnimationOptions';
import * as animations from './animations';

// create animationmanager
const animationManager = new AnimationManager();

// register animations
const allAnimations = Object.keys(animations).map((name: string) => animations[name]);
animationManager.register(allAnimations as IAnimationOptions[]);

// register with angular if it is present
if (typeof angular !== 'undefined') {
    angular.module('just.animate', []).service('just', () => animationManager);
}

// add animation properties to global Just
window.Just = animationManager;

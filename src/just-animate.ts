declare var require;
declare var angular;
declare var global;
var easings = require('./animations/easings.json');

import {AnimationManager} from './app/AnimationManager';
import * as animations from './animations/_all';
import {extend} from './app/helpers'

// create animationmanager
const animationManager = new AnimationManager();

// register easings
animationManager.configure(undefined, easings);

// register animations
for (let animationName in animations) {
    if (animations.hasOwnProperty(animationName)) {
        const animationOptions = animations[animationName];
        animationManager.register(animationName, animationOptions);
    }
}

// register with angular if it is present
if (typeof angular !== 'undefined') {
    angular.module('just.animate', []).service('just', () => animationManager);
}

// add animation properties to global Just
const root = (window || global) as any;
root.Just = root.Just || {};
extend(root.Just, animationManager);
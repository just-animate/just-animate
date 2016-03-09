declare var require;
var easings = require('./animations/easings.json');

import {AnimationManager} from './app/AnimationManager';
import * as animations from './animations/_all';

const animationManager = new AnimationManager();
animationManager.configure(undefined, easings);

for (let animationName in animations) {
    if (animations.hasOwnProperty(animationName)) {
        const animationOptions = animations[animationName];
        animationManager.register(animationName, animationOptions)
    }
}

window ['Just'] = animationManager;

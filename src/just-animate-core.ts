declare var window: Window & { Just: ja.IAnimationManager & ja.IAnimationInjectable };
declare var angular: any;

import {JustAnimate} from './JustAnimate';

// register with angular if it is present
if (typeof angular !== 'undefined') {
    angular.module('just.animate', []).service('just', JustAnimate);
}

// create manager if it doesn't yet exist
let animationManager: ja.IAnimationManager = undefined;
function getManager(): ja.IAnimationManager {
    if (animationManager === undefined) {
        animationManager = new JustAnimate();
    }
    return animationManager;
}

// add animation properties to global Just
const just: ja.IAnimationManager & ja.IAnimationInjectable = {
    animate(keyframesOrName: string | ja.IIndexed<ja.IKeyframe>, el: ja.ElementSource, timings?: ja.IAnimationEffectTiming): ja.IAnimator {
        return getManager().animate(keyframesOrName, el, timings);
    },
    animateSequence(options: ja.ISequenceOptions): ja.IAnimator {
        return getManager().animateSequence(options);
    },
    animateTimeline(options: ja.ITimelineOptions): ja.IAnimator {
        return getManager().animateTimeline(options);
    },
    findAnimation(name: string): ja.IKeyframeOptions {
        return getManager().findAnimation(name);
    },
    inject(animations: ja.IAnimationOptions[]): void {
        if (animationManager !== undefined) {
            console.warn('Animations must be injected prior to using Just.*');
        }
        JustAnimate.inject(animations);
    },
    register(animationOptions: ja.IAnimationOptions): ja.IAnimationManager {
        return getManager().register(animationOptions);
    }
};


window.Just = just;

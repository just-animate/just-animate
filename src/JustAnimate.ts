/// <reference path="./just-animate.d.ts" />

import {each, extend, isArray} from './core/helpers';
import {ElementAnimator} from './core/ElementAnimator';
import {SequenceAnimator} from './core/SequenceAnimator';
import {TimelineAnimator} from './core/TimelineAnimator';

const DEFAULT_ANIMATIONS = [];

export class JustAnimate implements ja.IAnimationManager {
    private _registry: { [key: string]: ja.IKeyframeOptions };
    private _timings: ja.IAnimationEffectTiming;
       
    public static inject(animations: ja.IAnimationOptions[]) {
        Array.prototype.push.apply(DEFAULT_ANIMATIONS, animations);
    }

    constructor() {
        this._timings = {
            duration: 1000,
            fill: 'both'
        };

        this._registry = {};
        each(DEFAULT_ANIMATIONS, a => {
            this._registry[a.name] = a
        });
    }

    public animate(keyframesOrName: string | ja.IIndexed<ja.IKeyframe>, 
                   el: ja.ElementSource, 
                   timings?: ja.IAnimationEffectTiming): ja.IAnimator {
        return new ElementAnimator(this, keyframesOrName, el, timings);
    }
    public animateSequence(options: ja.ISequenceOptions): ja.IAnimator {
        return new SequenceAnimator(this, options);
    }
    public animateTimeline(options: ja.ITimelineOptions): ja.IAnimator {
        return new TimelineAnimator(this, options);
    }
    public findAnimation(name: string): ja.IKeyframeOptions {
        return this._registry[name] || undefined;
    }
    public register(animationOptions: ja.IAnimationOptions): ja.IAnimationManager {
        this._registry[animationOptions.name] = animationOptions;
        return this;
    }
}
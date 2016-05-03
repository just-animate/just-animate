import {each, extend, isArray} from './app/helpers';
import {ElementAnimator} from './app/ElementAnimator';
import {SequenceAnimator} from './app/SequenceAnimator';
import {TimelineAnimator} from './app/TimelineAnimator';

export class AnimationManager implements just.IAnimationManager {
    private _registry: { [key: string]: just.IKeyframeOptions };
    private _timings: just.IAnimationEffectTiming;

    constructor() {
        this._registry = {};
        this._timings = {
            duration: 1000,
            fill: 'both'
        };
    }

    public animate(keyframesOrName: string | just.IIndexed<just.IKeyframe>, 
                   el: just.ElementSource, 
                   timings?: just.IAnimationEffectTiming): just.IAnimator {
        return new ElementAnimator(this, keyframesOrName, el, timings);
    }
    public animateSequence(options: just.ISequenceOptions): just.IAnimator {
        return new SequenceAnimator(this, options);
    }
    public animateTimeline(options: just.ITimelineOptions): just.IAnimator {
        return new TimelineAnimator(this, options);
    }
    public configure(timings?: just.IAnimationEffectTiming): just.IAnimationManager {
        if (timings) {
            extend(this._timings, timings);
        }
        return this;
    }
    public findAnimation(name: string): just.IKeyframeOptions {
        return this._registry[name] || undefined;
    }
    
    public register(animationOptions: just.IAnimationOptions): just.IAnimationManager;
    public register(animationOptionsList: just.IAnimationOptions[]): just.IAnimationManager;
    public register(animationOptions: just.IAnimationOptions|just.IAnimationOptions[]): just.IAnimationManager {
        const self = this;
        
        const registerAnimation = (it: just.IAnimationOptions) => {
            self[name] = (el: just.ElementSource, timings: just.IAnimationEffectTiming) => self.animate(name, el, timings);
            self._registry[name] = it;
        };
        
        if (isArray(animationOptions)) {
            each(animationOptions as just.IAnimationOptions[], registerAnimation);
        } else {
            self[name] = (el: just.ElementSource, timings: just.IAnimationEffectTiming) => self.animate(name, el, timings);
            self._registry[name] = animationOptions as just.IAnimationOptions;
        }
        
        return self;
    }
}
/// <reference path="./just-animate.d.ts" />

import {each, extend, isArray} from './core/helpers';
import {ElementAnimator} from './core/ElementAnimator';
import {SequenceAnimator} from './core/SequenceAnimator';
import {TimelineAnimator} from './core/TimelineAnimator';

const DEFAULT_ANIMATIONS = [];

/**
 * (description)
 * 
 * @export
 * @class JustAnimate
 * @implements {ja.IAnimationManager}
 */
export class JustAnimate implements ja.IAnimationManager {
    private _registry: { [key: string]: ja.IKeyframeOptions };
    private _timings: ja.IAnimationEffectTiming;
       
    /**
     * (description)
     * 
     * @static
     * @param {ja.IAnimationOptions[]} animations (description)
     */
    public static inject(animations: ja.IAnimationOptions[]) {
        Array.prototype.push.apply(DEFAULT_ANIMATIONS, animations);
    }

    /**
     * Creates an instance of JustAnimate.
     */
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

    /**
     * (description)
     * 
     * @param {(string | ja.IIndexed<ja.IKeyframe>)} keyframesOrName (description)
     * @param {ja.ElementSource} el (description)
     * @param {ja.IAnimationEffectTiming} [timings] (description)
     * @returns {ja.IAnimator} (description)
     */
    public animate(keyframesOrName: string | ja.IIndexed<ja.IKeyframe>, 
                   el: ja.ElementSource, 
                   timings?: ja.IAnimationEffectTiming): ja.IAnimator {
        return new ElementAnimator(this, keyframesOrName, el, timings);
    }
    /**
     * (description)
     * 
     * @param {ja.ISequenceOptions} options (description)
     * @returns {ja.IAnimator} (description)
     */
    public animateSequence(options: ja.ISequenceOptions): ja.IAnimator {
        return new SequenceAnimator(this, options);
    }
    /**
     * (description)
     * 
     * @param {ja.ITimelineOptions} options (description)
     * @returns {ja.IAnimator} (description)
     */
    public animateTimeline(options: ja.ITimelineOptions): ja.IAnimator {
        return new TimelineAnimator(this, options);
    }
    /**
     * (description)
     * 
     * @param {string} name (description)
     * @returns {ja.IKeyframeOptions} (description)
     */
    public findAnimation(name: string): ja.IKeyframeOptions {
        return this._registry[name] || undefined;
    }
    /**
     * (description)
     * 
     * @param {ja.IAnimationOptions} animationOptions (description)
     * @returns {ja.IAnimationManager} (description)
     */
    public register(animationOptions: ja.IAnimationOptions): ja.IAnimationManager {
        this._registry[animationOptions.name] = animationOptions;
        return this;
    }
}
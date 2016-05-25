import {each, extend, map} from './core/Helpers';
import { keyframeTransformer } from './core/KeyframeTransformers';
import {ElementAnimator} from './core/ElementAnimator';
import {SequenceAnimator} from './core/SequenceAnimator';
import {TimelineAnimator} from './core/TimelineAnimator';

const DEFAULT_ANIMATIONS: ja.IAnimationOptions[] = [];

/**
 * (description)
 * 
 * @export
 * @class JustAnimate
 * @implements {ja.IAnimationManager}
 */
export class JustAnimate implements ja.IAnimationManager {
    private _registry: { [key: string]: ja.IKeyframeOptions };
       
    /**
     * (description)
     * 
     * @static
     * @param {ja.IAnimationOptions[]} animations (description)
     */
    public static inject(animations: ja.IAnimationOptions[]): void {
        const animationDefs = map(animations, (a: ja.IAnimationOptions) => ({
            keyframes: map(a.keyframes, keyframeTransformer),
            name: a.name,
            timings: extend({}, a.timings)
        }));
        Array.prototype.push.apply(DEFAULT_ANIMATIONS, animationDefs);
    }

    /**
     * Creates an instance of JustAnimate.
     */
    constructor() {
        this._registry = {};
        each(DEFAULT_ANIMATIONS, (a: ja.IAnimationOptions) => this._registry[a.name] = a);
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
        const animationDef: ja.IAnimationOptions = {
            keyframes: map(animationOptions.keyframes, keyframeTransformer),
            name: animationOptions.name,
            timings: extend({}, animationOptions.timings)
        };
        
        this._registry[animationDef.name] = animationDef;
        return this;
    }
}

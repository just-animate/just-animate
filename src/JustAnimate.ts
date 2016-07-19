import {each} from './helpers/lists';
import {animationTransformer} from './core/WebTransformer';
import {ElementAnimator} from './core/ElementAnimator';
import {SequenceAnimator} from './core/SequenceAnimator';
import {TimelineAnimator} from './core/TimelineAnimator';

/**
 * (description)
 * 
 * @export
 * @class JustAnimate
 * @implements {ja.IAnimationManager}
 */
export class JustAnimate implements ja.IAnimationManager {
    private static _globalAnimations: ja.IMap<ja.IEffectOptions> = {};
    private _registry: { [key: string]: ja.IEffectOptions } = {};
       
    /**
     * (description)
     * 
     * @static
     * @param {ja.IAnimationOptions[]} animations (description)
     */
    public static inject(animations: ja.IAnimationOptions[]): void {
        each(animations, (a: ja.IAnimationOptions) => JustAnimate._globalAnimations[a.name] = a);
    }

    /**
     * (description)
     * 
     * @param {(string | ja.IKeyframeOptions[])} keyframesOrName (description)
     * @param {ja.ElementSource} el (description)
     * @param {ja.IAnimationEffectTiming} [timings] (description)
     * @returns {ja.IAnimator} (description)
     */
    public animate(keyframesOrName: string | ja.IKeyframeOptions[], 
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
     * @returns {ja.IEffectOptions} (description)
     */
    public findAnimation(name: string): ja.IEffectOptions {
        return this._registry[name] || JustAnimate._globalAnimations[name] || undefined;
    }
    /**
     * (description)
     * 
     * @param {ja.IAnimationOptions} animationOptions (description)
     * @returns {ja.IAnimationManager} (description)
     */
    public register(animationOptions: ja.IAnimationOptions): void {        
        this._registry[animationOptions.name] = animationTransformer(animationOptions);
    }

    /**
     * Calls global inject function
     * 
     * @static
     * @param {ja.IAnimationOptions[]} animations (description)
     */
    public inject(animations: ja.IAnimationOptions[]): void {
        JustAnimate.inject(animations);
    }
}

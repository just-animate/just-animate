import {easings} from '../easings';
import {head, multiapply, map, each, extend, isFunction, isString, max} from './Helpers';
import {keyframeTransformer} from './Transformers';
import {resolveElements} from './ElementResolver';

/**
 * Animates one or more elements
 * 
 * @export
 * @class ElementAnimator
 * @implements {ja.IAnimator}
 */
export class ElementAnimator implements ja.IAnimator {
    /**
     * The duration of the animation in milliseconds
     * 
     * @type {number}
     */
    public duration: number;
    /**
     * Called when the animation is finished
     * 
     * @type {ja.IConsumer<ja.IAnimator>}
     */
    public onfinish: ja.IConsumer<ja.IAnimator>;
    /**
     * Called when the animation is canceled
     * 
     * @type {ja.IConsumer<ja.IAnimator>}
     */
    public oncancel: ja.IConsumer<ja.IAnimator>;
    
    private _animators: ja.IAnimator[];

    /**
     * Returns 0 when not playing, 1 when playing forward, and -1 when playing backward
     * 
     * @type {number}
     */
    public get playbackRate(): number {
        const first = head(this._animators);
        return first ? first.playbackRate : 0;
    }
    /**
     * Sets the playbackRate to the specified value
     */
    public set playbackRate(val: number) {
        each(this._animators, (a: ja.IAnimator) => a.playbackRate = val);
    }    

    /**
     * Creates an instance of ElementAnimator.
     * 
     * @param {ja.IAnimationManager} manager JustAnimate instance
     * @param {(string | ja.IIndexed<ja.IKeyframe>)} keyframesOrName keyframe definition or name of registered animation
     * @param {ja.ElementSource} el element or element source to animate
     * @param {ja.IAnimationEffectTiming} [timings] optional timing overrides.  required when passing in keyframes
     */
    constructor(manager: ja.IAnimationManager, keyframesOrName: string | ja.IIndexed<ja.IKeyframe>, 
                el: ja.ElementSource, timings?: ja.IAnimationEffectTiming) {
        if (!keyframesOrName) {
            return;
        }
        
        let keyframes: ja.IIndexed<ja.IKeyframe>;
        if (isString(keyframesOrName)) {
            // if keyframes is a string, lookup keyframes from registry
            const definition = manager.findAnimation(keyframesOrName as string);
            keyframes = definition.keyframes;

            // use registered timings as default, then load timings from params           
            timings = extend({}, definition.timings, timings);
        } else {
            // otherwise, translate keyframe properties
            keyframes = map(keyframesOrName as ja.IKeyframe[], keyframeTransformer);
        }

        if (timings && timings.easing) {
            // if timings contains an easing property, 
            const easing = easings[timings.easing];
            if (easing) {
                timings.easing = easing;
            }
        }

        // add duration to object    
        this.duration = timings.duration;        

        // get list of elements to animate
        const elements = resolveElements(el);

        // call .animate on all elements and get a list of their players        
        this._animators = multiapply(elements, 'animate', [keyframes, timings]) as ja.IAnimator[];

        // hookup finish event for when it happens naturally    
        if (this._animators.length > 0) {
            // todo: try to find a better way than just listening to one of them
            /**
             * (description)
             */
            this._animators[0].onfinish = () => {
                this.finish();
            };
        }        
    }

    /**
     * Returns current time of the animation
     * 
     * @type {number}
     */
    get currentTime(): number {
        return max(this._animators, 'currentTime') || 0;
    }
    /**
     * Sets the animation current time
     */
    set currentTime(elapsed: number) {
        each(this._animators, (a: ja.IAnimator) => a.currentTime = elapsed);
    }

    /**
     * Finishes the current animation
     * 
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of the Element Animator
     */
    public finish(fn?: ja.ICallbackHandler): ja.IAnimator {
        multiapply(this._animators, 'finish', [], fn);
        if (this.playbackRate < 0) {
            each(this._animators, (a: ja.IAnimator) => a.currentTime = 0);
        } else {
            each(this._animators, (a: ja.IAnimator) => a.currentTime = this.duration);
        }
        if (isFunction(this.onfinish)) {
            this.onfinish(this);
        }
        return this;
    }
    /**
     * Plays the animation
     * 
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of Element Animator
     */
    public play(fn?: ja.ICallbackHandler): ja.IAnimator {
        multiapply(this._animators, 'play', [], fn);
        return this;
    }
    /**
     * Pauses the animation
     * 
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator}  this instance of Element Animator
     */
    public pause(fn?: ja.ICallbackHandler): ja.IAnimator {
        multiapply(this._animators, 'pause', [], fn);
        return this;
    }
    /**
     * Reverses the direction of the animation
     * 
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of Element Animator
     */
    public reverse(fn?: ja.ICallbackHandler): ja.IAnimator {
        multiapply(this._animators, 'reverse', [], fn);
        return this;
    }
    /**
     * Cancels the animation
     * 
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of Element Animator
     */
    public cancel(fn?: ja.ICallbackHandler): ja.IAnimator {
        multiapply(this._animators, 'cancel', [], fn);
        each(this._animators, (a: ja.IAnimator) => a.currentTime = 0);
        if (isFunction(this.oncancel)) {
            this.oncancel(this);
        }
        return this;
    }
}


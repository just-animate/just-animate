import {easings} from '../easings';
import {queryElements} from '../helpers/elements';
import {multiapply, pipe} from '../helpers/functions';
import {extend} from '../helpers/objects';
import {head, map, each, max} from '../helpers/lists';
import {isString} from '../helpers/type';
import {normalizeProperties, normalizeKeyframes, spaceKeyframes} from '../helpers/keyframes';
import {Dispatcher} from './Dispatcher';

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

    private _animators: ja.IAnimator[];
    private _dispatcher: Dispatcher = new Dispatcher();

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
     * @param {(string | ja.IKeyframeOptions[])} keyframesOrName keyframe definition or name of registered animation
     * @param {ja.ElementSource} el element or element source to animate
     * @param {ja.IAnimationEffectTiming} [timings] optional timing overrides.  required when passing in keyframes
     */
    constructor(manager: ja.IAnimationManager, 
                keyframesOrName: string | ja.IKeyframeOptions[],
                el: ja.ElementSource, 
                timings?: ja.IAnimationEffectTiming) {

        if (!keyframesOrName) {
            return;
        }

        let keyframes: ja.IKeyframeOptions[];
        
        if (isString(keyframesOrName)) {
            // if keyframes is a string, lookup keyframes from registry
            const definition = manager.findAnimation(keyframesOrName as string);
            keyframes = pipe(map(definition.keyframes, normalizeProperties), spaceKeyframes, normalizeKeyframes);

            // use registered timings as default, then load timings from params           
            timings = extend({}, definition.timings, timings);
        } else {
            // otherwise, translate keyframe properties
            keyframes = pipe(map(keyframesOrName as ja.IKeyframeOptions[], normalizeProperties), spaceKeyframes, normalizeKeyframes);
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
        const elements = queryElements(el);

        // call .animate on all elements and get a list of their players        
        this._animators = multiapply(elements, 'animate', [keyframes, timings]) as ja.IAnimator[];

        // hookup finish event for when it happens naturally    
        if (this._animators.length > 0) {
            // todo: try to find a better way than just listening to one of them
            this._animators[0].addEventListener('finish', () => this.finish());
        }
    }

    public addEventListener(eventName: string, listener: Function): void {
        this._dispatcher.on(eventName, listener);
    }

    public removeEventListener(eventName: string, listener: Function): void {
       this._dispatcher.off(eventName, listener);
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
    public finish(fn?: ja.ICallbackHandler): void {
        multiapply(this._animators, 'finish', []);
        if (this.playbackRate < 0) {
            each(this._animators, (a: ja.IAnimator) => a.currentTime = 0);
        } else {
            each(this._animators, (a: ja.IAnimator) => a.currentTime = this.duration);
        }
        this._dispatcher.trigger('finish');
    }
    /**
     * Plays the animation
     * 
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of Element Animator
     */
    public play(): void {
        multiapply(this._animators, 'play', []);
    }
    /**
     * Pauses the animation
     * 
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator}  this instance of Element Animator
     */
    public pause(): void {
        multiapply(this._animators, 'pause', []);
    }
    /**
     * Reverses the direction of the animation
     * 
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of Element Animator
     */
    public reverse(): void {
        multiapply(this._animators, 'reverse', []);
    }
    /**
     * Cancels the animation
     * 
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of Element Animator
     */
    public cancel(): void {
        multiapply(this._animators, 'cancel', []);
        each(this._animators, (a: ja.IAnimator) => a.currentTime = 0);
        this._dispatcher.trigger('cancel');
    }
}


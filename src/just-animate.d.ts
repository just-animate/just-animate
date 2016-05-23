declare const Just: ja.IAnimationManager & ja.IAnimationInjectable;

declare module ja {
    export type FillMode = "none" | "forwards" | "backwards" | "both" | "auto";
   // export type PlaybackDiraction = "normal" | "reverse" | "alternate" | "alternate-reverse";

    export type Easing = string
        | "ease"
        | "linear"
        | "initial"
        | "ease-in"
        | "ease-out"
        | "ease-in-out"
        | "easeInCubic"
        | "easeOutCubic"
        | "easeInOutCubic"
        | "easeInCirc"
        | "easeOutCirc"
        | "easeInOutCirc"
        | "easeInExpo"
        | "easeOutExpo"
        | "easeInOutExpo"
        | "easeInQuad"
        | "easeOutQuad"
        | "easeInOutQuad"
        | "easeInQuart"
        | "easeOutQuart"
        | "easeInOutQuart"
        | "easeInQuint"
        | "easeOutQuint"
        | "easeInOutQuint"
        | "easeInSine"
        | "easeOutSine"
        | "easeInOutSine"
        | "easeInBack"
        | "easeOutBack"
        | "easeInOutBack"
        | "elegantSlowStartEnd";

    /**
     * (description)
     * 
     * @export
     * @interface IAnimationEffectTiming
     */
    export interface IAnimationEffectTiming {
        // delay?: number;
        // direction?: PlaybackDiraction;
        /**
         * (description)
         * 
         * @type {number}
         */
        duration?: number;
        /**
         * (description)
         * 
         * @type {Easing}
         */
        easing?: Easing;
        // endDelay?: number;
        /**
         * (description)
         * 
         * @type {FillMode}
         */
        fill?:  FillMode;
        // iterationStart?: number;
        /**
         * (description)
         * 
         * @type {number}
         */
        iterations?: number;
    }

    /**
     * (description)
     * 
     * @export
     * @interface IAnimationInjectable
     */
    export interface IAnimationInjectable {
        /**
         * (description)
         * 
         * @param {IAnimationOptions[]} animationOptionList (description)
         */
        inject(animationOptionList: IAnimationOptions[]): void;
    }

    /**
     * (description)
     * 
     * @export
     * @interface IAnimationManager
     */
    export interface IAnimationManager {
        /**
         * (description)
         * 
         * @param {(string | IIndexed<IKeyframe>)} keyframesOrName (description)
         * @param {ElementSource} el (description)
         * @param {IAnimationEffectTiming} [timings] (description)
         * @returns {IAnimator} (description)
         */
        animate(keyframesOrName: string | IIndexed<IKeyframe>, el: ElementSource, timings?: IAnimationEffectTiming): IAnimator;
        /**
         * (description)
         * 
         * @param {ISequenceOptions} options (description)
         * @returns {IAnimator} (description)
         */
        animateSequence(options: ISequenceOptions): IAnimator;
        /**
         * (description)
         * 
         * @param {ITimelineOptions} options (description)
         * @returns {IAnimator} (description)
         */
        animateTimeline(options: ITimelineOptions): IAnimator;
        /**
         * (description)
         * 
         * @param {string} name (description)
         * @returns {IKeyframeOptions} (description)
         */
        findAnimation(name: string): IKeyframeOptions;
        /**
         * (description)
         * 
         * @param {IAnimationOptions} animationOptions (description)
         * @returns {IAnimationManager} (description)
         */
        register(animationOptions: IAnimationOptions): IAnimationManager;
    }

    /**
     * (description)
     * 
     * @export
     * @interface IAnimationOptions
     * @extends {IKeyframeOptions}
     */
    export interface IAnimationOptions extends IKeyframeOptions {
        /**
         * (description)
         * 
         * @type {string}
         */
        name: string;
        /**
         * (description)
         * 
         * @type {IIndexed<IKeyframe>}
         */
        keyframes: IIndexed<IKeyframe>;
        /**
         * (description)
         * 
         * @type {IAnimationEffectTiming}
         */
        timings?: IAnimationEffectTiming;
    }

    /**
     * (description)
     * 
     * @export
     * @interface IAnimator
     */
    export interface IAnimator {
        // effect?: any;
        // timeline?: any;
        /**
         * (description)
         * 
         * @type {number}
         */
        currentTime: number;
        /**
         * (description)
         * 
         * @type {number}
         */
        duration: number;
        // startTime: number;
        /**
         * (description)
         * 
         * @type {number}
         */
        playbackRate: number;

        /**
         * (description)
         * 
         * @type {IConsumer<IAnimator>}
         */
        onfinish?: IConsumer<IAnimator>;
        /**
         * (description)
         * 
         * @type {IConsumer<IAnimator>}
         */
        oncancel?: IConsumer<IAnimator>;

        /**
         * (description)
         * 
         * @param {ICallbackHandler} [fn] (description)
         * @returns {IAnimator} (description)
         */
        finish(fn?: ICallbackHandler): IAnimator;
        /**
         * (description)
         * 
         * @param {ICallbackHandler} [fn] (description)
         * @returns {IAnimator} (description)
         */
        play(fn?: ICallbackHandler): IAnimator;
        /**
         * (description)
         * 
         * @param {ICallbackHandler} [fn] (description)
         * @returns {IAnimator} (description)
         */
        pause(fn?: ICallbackHandler): IAnimator;
        /**
         * (description)
         * 
         * @param {ICallbackHandler} [fn] (description)
         * @returns {IAnimator} (description)
         */
        reverse(fn?: ICallbackHandler): IAnimator;
        /**
         * (description)
         * 
         * @param {ICallbackHandler} [fn] (description)
         * @returns {IAnimator} (description)
         */
        cancel(fn?: ICallbackHandler): IAnimator;
    }


    /**
     * (description)
     * 
     * @export
     * @interface ICallbackHandler
     */
    export interface ICallbackHandler {
        (err: (string|Error)[]): void;
    }

    /**
     * (description)
     * 
     * @export
     * @interface IConsumer
     * @template T1
     */
    export interface IConsumer<T1> {
        (consumable: T1): any;
    }

    export type ElementSource = Node | IIndexed<Node> | NodeList | string | IElementProvider;

    /**
     * (description)
     * 
     * @export
     * @interface IElementProvider
     */
    export interface IElementProvider {
        (): Node | IIndexed<Node> | NodeList;
    }

    /**
     * (description)
     * 
     * @export
     * @interface IIndexed
     * @template T
     */
    export interface IIndexed<T> {
        [index: number]: T;
        /**
         * (description)
         * 
         * @type {number}
         */
        length: number;
    }

    /**
     * (description)
     * 
     * @export
     * @interface IKeyframe
     */
    export interface IKeyframe {
        /**
         * (description)
         * 
         * @type {number}
         */
        offset?: number;
        // css animation properties
        /**
         * (description)
         * 
         * @type {number}
         */
        '-moz-outline-radius'?: number;
        /**
         * (description)
         * 
         * @type {string}
         */
        '-moz-outline-radius-bottomleft'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        '-moz-outline-radius-bottomright'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        '-moz-outline-radius-topleft'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        '-moz-outline-radius-topright'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        '-webkit-text-stroke'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        '-webkit-text-stroke-color'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        '-webkit-touch-callout'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'all'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'backdrop-filter'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'background'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'background-color'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'background-position'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'background-size'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-bottom'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-bottom-color'?: string;
        /**
         * (description)
         * 
         * @type {number}
         */
        'border-bottom-left-radius'?: number;
        /**
         * (description)
         * 
         * @type {number}
         */
        'border-bottom-right-radius'?: number;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-bottom-width'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-color'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-left'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-left-color'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-left-width'?: string;
        /**
         * (description)
         * 
         * @type {number}
         */
        'border-radius'?: number;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-right'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-right-color'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-right-width'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-top'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-top-color'?: string;
        /**
         * (description)
         * 
         * @type {number}
         */
        'border-top-left-radius'?: number;
        /**
         * (description)
         * 
         * @type {number}
         */
        'border-top-right-radius'?: number;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-top-width'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'border-width'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'bottom'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'box-shadow'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'clip'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'clip-path'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'color'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'column-count'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'column-gap'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'column-rule'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'column-rule-color'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'column-rule-width'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'column-width'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'columns'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'filter'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'flex'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'flex-basis'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'flex-grow'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'flex-shrink'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'font'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'font-size'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'font-size-adjust'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'font-stretch'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'font-weight'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'grid-column-gap'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'grid-gap'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'grid-row-gap'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'height'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'left'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'letter-spacing'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'line-height'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'margin'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'margin-bottom'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'margin-left'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'margin-right'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'margin-top'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'mask'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'mask-position'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'mask-size'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'max-height'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'max-width'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'min-height'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'min-width'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'motion-offset'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'motion-rotation'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'object-position'?: string;
        /**
         * (description)
         * 
         * @type {number}
         */
        'opacity'?: number;
        /**
         * (description)
         * 
         * @type {number}
         */
        'order'?: number;
        /**
         * (description)
         * 
         * @type {string}
         */
        'outline'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'outline-color'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'outline-offset'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'outline-width'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'padding'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'padding-bottom'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'padding-left'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'padding-right'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'padding-top'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'perspective'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'perspective-origin'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'right'?: string;
        /**
         * Shortform for 'transform: rotate()'.
         * Pass a single string to rotate the same amount in all directions,
         * or an array of 2 strings to set the X, Y, Z axes
         * 
         * @type {(string|string[])}
         */
        'rotate'?: string | string[];
        /**
         * Shortform for 'transform: rotate3d()'.
         * Pass a single string to rotate the same amount in all directions,
         * or an array of 3 strings to set the X, Y, Z axes
         * 
         * @type {(string|string[])}
         */
        'rotate3d'?: string | string[];
        /**
         * Shortform for 'transform: rotateX()'.
         * Pass a single string 
         * 
         * @type {string}
         */
        'rotateX'?: string;
        /**
         * Shortform for 'transform: rotateY()'.
         * Pass a single string 
         * 
         * @type {string}
         */
        'rotateY'?: string;
        /**
         * Shortform for 'transform: rotateZ()'.
         * Pass a single string 
         * 
         * @type {string}
         */
        'rotateZ'?: string;
                /**
         * Shortform for 'transform: scale()'.
         * Pass a single number to scale the same amount in all directions,
         * or an array of 2 numbers to set the X, Y, Z axes
         * 
         * @type {(number|number[])}
         */
        'scale'?: number | number[];
        /**
         * Shortform for 'transform: scale3d()'.
         * Pass a single number to scale the same amount in all directions,
         * or an array of 3 numbers to set the X, Y, Z axes
         * 
         * @type {(number|number[])}
         */
        'scale3d'?: number | number[];
        /**
         * Shortform for 'transform: scaleX()'.
         * Pass a single number 
         * 
         * @type {number}
         */
        'scaleX'?: number;
        /**
         * Shortform for 'transform: scaleY()'.
         * Pass a single number 
         * 
         * @type {number}
         */
        'scaleY'?: number;
        /**
         * Shortform for 'transform: scaleZ()'.
         * Pass a single number 
         * 
         * @type {number}
         */
        'scaleZ'?: number;
        /**
         * (description)
         * 
         * @type {string}
         */
        'scroll-snap-coordinate'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'scroll-snap-destination'?: string;
        /**
         * Shortform for 'transform: skew()'.
         * Pass a single string to skew the same amount in all directions,
         * or an array of 2 strings to set the X, Y, Z axes
         * 
         * @type {(string|string[])}
         */
        'skew'?: string | string[];
        /**
         * Shortform for 'transform: skew3d()'.
         * Pass a single string to skew the same amount in all directions,
         * or an array of 3 strings to set the X, Y, Z axes
         * 
         * @type {(string|string[])}
         */
        'skew3d'?: string | string[];
        /**
         * Shortform for 'transform: skewX()'.
         * Pass a single string 
         * 
         * @type {string}
         */
        'skewX'?: string;
        /**
         * Shortform for 'transform: skewY()'.
         * Pass a single string 
         * 
         * @type {string}
         */
        'skewY'?: string;
        /**
         * Shortform for 'transform: skewZ()'.
         * Pass a single string 
         * 
         * @type {string}
         */
        'skewZ'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'shape-image-threshold'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'shape-margin'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'shape-outside'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'text-decoration'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'text-decoration-color'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'text-emphasis'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'text-emphasis-color'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'text-indent'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'text-shadow'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'top'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'transform'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'transform-origin'?: string;
        /**
         * Shortform for 'transform: translate()'.
         * Pass a single string to translate the same amount in all directions,
         * or an array of 2 strings to set the X, Y, Z axes
         * 
         * @type {(string|string[])}
         */
        'translate'?: string | string[];
        /**
         * Shortform for 'transform: translate3d()'.
         * Pass a single string to translate the same amount in all directions,
         * or an array of 3 strings to set the X, Y, Z axes
         * 
         * @type {(string|string[])}
         */
        'translate3d'?: string | string[];
        /**
         * Shortform for 'transform: translateX()'.
         * Pass a single string 
         * 
         * @type {string}
         */
        'translateX'?: string;
        /**
         * Shortform for 'transform: translateY()'.
         * Pass a single string 
         * 
         * @type {string}
         */
        'translateY'?: string;
        /**
         * Shortform for 'transform: translateZ()'.
         * Pass a single string 
         * 
         * @type {string}
         */
        'translateZ'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'vertical-align'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'visibility'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'width'?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        'word-spacing'?: string;
        /**
         * (description)
         * 
         * @type {number}
         */
        'z-index'?: number;
    }

    /**
     * (description)
     * 
     * @export
     * @interface IKeyframeOptions
     */
    export interface IKeyframeOptions {
        /**
         * (description)
         * 
         * @type {IIndexed<IKeyframe>}
         */
        keyframes: IIndexed<IKeyframe>;
        /**
         * (description)
         * 
         * @type {IAnimationEffectTiming}
         */
        timings?: IAnimationEffectTiming;
    }

    /**
     * (description)
     * 
     * @export
     * @interface IMap
     * @template T
     */
    export interface IMap<T> {
        [name: string]: T;
    }

    /**
     * (description)
     * 
     * @export
     * @interface IMapper
     * @template T1
     * @template T2
     */
    export interface IMapper<T1, T2> {
        (mapable: T1): T2;
    }

    /**
     * (description)
     * 
     * @export
     * @interface ISequenceEvent
     */
    export interface ISequenceEvent {
        /**
         * (description)
         * 
         * @type {ElementSource}
         */
        el: ElementSource;
        /**
         * (description)
         * 
         * @type {string}
         */
        name?: string;
        /**
         * (description)
         * 
         * @type {string}
         */
        command?: string;
        /**
         * (description)
         * 
         * @type {IAnimationEffectTiming}
         */
        timings?: IAnimationEffectTiming;
        /**
         * (description)
         * 
         * @type {IIndexed<IKeyframe>}
         */
        keyframes?: IIndexed<IKeyframe>;
    }

    /**
     * (description)
     * 
     * @export
     * @interface ISequenceOptions
     */
    export interface ISequenceOptions {
        /**
         * (description)
         * 
         * @type {ISequenceEvent[]}
         */
        steps: ISequenceEvent[];
        /**
         * (description)
         * 
         * @type {boolean}
         */
        autoplay?: boolean;
    }

    /**
     * (description)
     * 
     * @export
     * @interface ITimelineEvent
     */
    export interface ITimelineEvent {
        /**
         * (description)
         * 
         * @type {number}
         */
        offset: number;
        /**
         * (description)
         * 
         * @type {ElementSource}
         */
        el: ElementSource;
        /**
         * (description)
         * 
         * @type {string}
         */
        name?: string;
        /**
         * (description)
         * 
         * @type {IAnimationEffectTiming}
         */
        timings?: IAnimationEffectTiming;
        /**
         * (description)
         * 
         * @type {IIndexed<IKeyframe>}
         */
        keyframes?: IIndexed<IKeyframe>;
    }

    /**
     * (description)
     * 
     * @export
     * @interface ITimelineOptions
     */
    export interface ITimelineOptions {
        /**
         * (description)
         * 
         * @type {ITimelineEvent[]}
         */
        events: ITimelineEvent[];
        /**
         * (description)
         * 
         * @type {number}
         */
        duration: number;
        /**
         * (description)
         * 
         * @type {boolean}
         */
        autoplay?: boolean;
    }
}

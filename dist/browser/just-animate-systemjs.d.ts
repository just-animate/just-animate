/// <reference path="../../src/just-animate.d.ts" />
declare module "just-animate/core/Helpers" {
    /**
     * No operation function: a placeholder
     *
     * @export
     */
    export function noop(): void;
    /**
     * Clamps a number between the min and max
     *
     * @export
     * @param {number} val number to clamp
     * @param {number} min min number allowed
     * @param {number} max max number allowed
     * @returns {number} val if between min-max, min if lesser, max if greater
     */
    export function clamp(val: number, min: number, max: number): number;
    /**
     * Returns the first object in the list or undefined
     *
     * @export
     * @template T
     * @param {ja.IIndexed<T>} indexed list of objects
     * @returns {T} first object in the list or undefined
     */
    export function head<T>(indexed: ja.IIndexed<T>): T;
    /**
     * Returns the last object in the list or undefined
     *
     * @export
     * @template T
     * @param {ja.IIndexed<T>} indexed list of objects
     * @returns {T} last object in the list or undefined
     */
    export function tail<T>(indexed: ja.IIndexed<T>): T;
    /**
     * Tests if object is a list
     *
     * @export
     * @param {*} a object to test
     * @returns {boolean} true if is not a string and length property is a number
     */
    export function isArray(a: any): boolean;
    /**
     * Tests if object is a function
     *
     * @export
     * @param {*} a object to test
     * @returns {boolean} true if object.toString reports it as a Function
     */
    export function isFunction(a: any): boolean;
    /**
     * Tests if object is a number
     *
     * @export
     * @param {*} a object to test
     * @returns {boolean} true if the object is typeof number
     */
    export function isNumber(a: any): boolean;
    /**
     * Tests if object is a string
     *
     * @export
     * @param {*} a object to test
     * @returns {boolean} true if object is typeof string
     */
    export function isString(a: any): boolean;
    /**
     * Converts list to an Array.
     * Useful for converting NodeList and arguments to []
     *
     * @export
     * @template T
     * @param {ja.IIndexed<T>} list to convert
     * @returns {T[]} array clone of list
     */
    export function toArray<T>(indexed: ja.IIndexed<T>): T[];
    /**
     * Performs the function against all objects in the list
     *
     * @export
     * @template T1
     * @param {ja.IIndexed<T1>} items list of objects
     * @param {ja.IConsumer<T1>} fn function to execute for each object
     */
    export function each<T1>(items: ja.IIndexed<T1>, fn: ja.IConsumer<T1>): void;
    /**
     * Returns the max value of a given property in a list
     *
     * @export
     * @template T1
     * @param {ja.IIndexed<T1>} items list of objects
     * @param {string} propertyName property to evaluate
     * @returns {*} max value of the property provided
     */
    export function max<T1>(items: ja.IIndexed<T1>, propertyName: string): any;
    /**
     * Maps one list of objects to another.
     * Returning undefined skips the item (effectively filtering it)
     *
     * @export
     * @template T1
     * @template T2
     * @param {ja.IIndexed<T1>} items list of objects to map
     * @param {ja.IMapper<T1, T2>} fn function that maps each object
     * @returns {T2[]} new list of objects
     */
    export function map<T1, T2>(items: ja.IIndexed<T1>, fn: ja.IMapper<T1, T2>): T2[];
    /**
     * Extends the first object with the properties of each subsequent object
     *
     * @export
     * @param {*} target object to extend
     * @param {...any[]} sources sources from which to inherit properties
     * @returns {*} first object
     */
    export function extend(target: any, ...sources: any[]): any;
    /**
     * Calls the named function for each object in the list
     *
     * @export
     * @param {ja.IIndexed<any>} targets list of objects on which to call a function
     * @param {string} fnName function name to call on each object
     * @param {ja.IIndexed<any>} args list of arguments to pass to the function
     * @param {ja.ICallbackHandler} [cb] optional error handlers
     * @returns {any[]} all results as an array
     */
    export function multiapply(targets: ja.IIndexed<any>, fnName: string, args: ja.IIndexed<any>, cb?: ja.ICallbackHandler): any[];
}
declare module "just-animate/core/KeyframeTransformers" {
    /**
     * Handles transforming short hand key properties into their native form
     */
    export function keyframeTransformer(keyframe: ja.IKeyframe): ja.IKeyframe;
}
declare module "just-animate/easings" {
    export const easings: {
        'easeInCubic': string;
        'easeOutCubic': string;
        'easeInOutCubic': string;
        'easeInCirc': string;
        'easeOutCirc': string;
        'easeInOutCirc': string;
        'easeInExpo': string;
        'easeOutExpo': string;
        'easeInOutExpo': string;
        'easeInQuad': string;
        'easeOutQuad': string;
        'easeInOutQuad': string;
        'easeInQuart': string;
        'easeOutQuart': string;
        'easeInOutQuart': string;
        'easeInQuint': string;
        'easeOutQuint': string;
        'easeInOutQuint': string;
        'easeInSine': string;
        'easeOutSine': string;
        'easeInOutSine': string;
        'easeInBack': string;
        'easeOutBack': string;
        'easeInOutBack': string;
        'elegantSlowStartEnd': string;
    };
}
declare module "just-animate/core/ElementAnimator" {
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
        duration: number;
        /**
         * Called when the animation is finished
         *
         * @type {ja.IConsumer<ja.IAnimator>}
         */
        onfinish: ja.IConsumer<ja.IAnimator>;
        /**
         * Called when the animation is canceled
         *
         * @type {ja.IConsumer<ja.IAnimator>}
         */
        oncancel: ja.IConsumer<ja.IAnimator>;
        private _animators;
        /**
         * Returns 0 when not playing, 1 when playing forward, and -1 when playing backward
         *
         * @type {number}
         */
        /**
         * Sets the playbackRate to the specified value
         */
        playbackRate: number;
        /**
         * Creates an instance of ElementAnimator.
         *
         * @param {ja.IAnimationManager} manager JustAnimate instance
         * @param {(string | ja.IIndexed<ja.IKeyframe>)} keyframesOrName keyframe definition or name of registered animation
         * @param {ja.ElementSource} el element or element source to animate
         * @param {ja.IAnimationEffectTiming} [timings] optional timing overrides.  required when passing in keyframes
         */
        constructor(manager: ja.IAnimationManager, keyframesOrName: string | ja.IIndexed<ja.IKeyframe>, el: ja.ElementSource, timings?: ja.IAnimationEffectTiming);
        /**
         * Returns current time of the animation
         *
         * @type {number}
         */
        /**
         * Sets the animation current time
         */
        currentTime: number;
        /**
         * Finishes the current animation
         *
         * @param {ja.ICallbackHandler} [fn] optional error handler
         * @returns {ja.IAnimator} this instance of the Element Animator
         */
        finish(fn?: ja.ICallbackHandler): ja.IAnimator;
        /**
         * Plays the animation
         *
         * @param {ja.ICallbackHandler} [fn] optional error handler
         * @returns {ja.IAnimator} this instance of Element Animator
         */
        play(fn?: ja.ICallbackHandler): ja.IAnimator;
        /**
         * Pauses the animation
         *
         * @param {ja.ICallbackHandler} [fn] optional error handler
         * @returns {ja.IAnimator}  this instance of Element Animator
         */
        pause(fn?: ja.ICallbackHandler): ja.IAnimator;
        /**
         * Reverses the direction of the animation
         *
         * @param {ja.ICallbackHandler} [fn] optional error handler
         * @returns {ja.IAnimator} this instance of Element Animator
         */
        reverse(fn?: ja.ICallbackHandler): ja.IAnimator;
        /**
         * Cancels the animation
         *
         * @param {ja.ICallbackHandler} [fn] optional error handler
         * @returns {ja.IAnimator} this instance of Element Animator
         */
        cancel(fn?: ja.ICallbackHandler): ja.IAnimator;
    }
}
declare module "just-animate/core/SequenceAnimator" {
    /**
     * (description)
     *
     * @export
     * @class SequenceAnimator
     * @implements {ja.IAnimator}
     */
    export class SequenceAnimator implements ja.IAnimator {
        /**
         * (description)
         *
         * @type {number}
         */
        playbackRate: number;
        /**
         * (description)
         *
         * @type {ja.IConsumer<ja.IAnimator>}
         */
        onfinish: ja.IConsumer<ja.IAnimator>;
        /**
         * (description)
         *
         * @type {ja.IConsumer<ja.IAnimator>}
         */
        oncancel: ja.IConsumer<ja.IAnimator>;
        private _currentIndex;
        private _errorCallback;
        private _manager;
        private _steps;
        /**
         * (description)
         *
         * @readonly
         * @type {number}
         */
        currentTime: number;
        /**
         * (description)
         *
         * @readonly
         * @type {number}
         */
        duration: number;
        /**
         * Creates an instance of SequenceAnimator.
         *
         * @param {ja.IAnimationManager} manager (description)
         * @param {ja.ISequenceOptions} options (description)
         */
        constructor(manager: ja.IAnimationManager, options: ja.ISequenceOptions);
        /**
         * (description)
         *
         * @param {ja.ICallbackHandler} [fn] (description)
         * @returns {ja.IAnimator} (description)
         */
        finish(fn?: ja.ICallbackHandler): ja.IAnimator;
        /**
         * (description)
         *
         * @param {ja.ICallbackHandler} [fn] (description)
         * @returns {ja.IAnimator} (description)
         */
        play(fn?: ja.ICallbackHandler): ja.IAnimator;
        /**
         * (description)
         *
         * @param {ja.ICallbackHandler} [fn] (description)
         * @returns {ja.IAnimator} (description)
         */
        pause(fn?: ja.ICallbackHandler): ja.IAnimator;
        /**
         * (description)
         *
         * @param {ja.ICallbackHandler} [fn] (description)
         * @returns {ja.IAnimator} (description)
         */
        reverse(fn?: ja.ICallbackHandler): ja.IAnimator;
        /**
         * (description)
         *
         * @param {ja.ICallbackHandler} [fn] (description)
         * @returns {ja.IAnimator} (description)
         */
        cancel(fn?: ja.ICallbackHandler): ja.IAnimator;
        private _isInEffect();
        private _getAnimator();
        private _playNextStep(evt);
        private _playThisStep();
    }
}
declare module "just-animate/core/TimelineAnimator" {
    /**
     * (description)
     *
     * @export
     * @class TimelineAnimator
     * @implements {ja.IAnimator}
     */
    export class TimelineAnimator implements ja.IAnimator {
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
        /**
         * (description)
         *
         * @type {number}
         */
        playbackRate: number;
        /**
         * (description)
         *
         * @type {ja.IConsumer<ja.IAnimator>}
         */
        onfinish: ja.IConsumer<ja.IAnimator>;
        /**
         * (description)
         *
         * @type {ja.IConsumer<ja.IAnimator>}
         */
        oncancel: ja.IConsumer<ja.IAnimator>;
        private _events;
        private _isInEffect;
        private _isFinished;
        private _isCanceled;
        private _isPaused;
        private _lastTick;
        private _manager;
        /**
         * Creates an instance of TimelineAnimator.
         *
         * @param {ja.IAnimationManager} manager (description)
         * @param {ja.ITimelineOptions} options (description)
         */
        constructor(manager: ja.IAnimationManager, options: ja.ITimelineOptions);
        /**
         * (description)
         *
         * @param {ja.ICallbackHandler} [fn] (description)
         * @returns {ja.IAnimator} (description)
         */
        finish(fn?: ja.ICallbackHandler): ja.IAnimator;
        /**
         * (description)
         *
         * @param {ja.ICallbackHandler} [fn] (description)
         * @returns {ja.IAnimator} (description)
         */
        play(fn?: ja.ICallbackHandler): ja.IAnimator;
        /**
         * (description)
         *
         * @param {ja.ICallbackHandler} [fn] (description)
         * @returns {ja.IAnimator} (description)
         */
        pause(fn?: ja.ICallbackHandler): ja.IAnimator;
        /**
         * (description)
         *
         * @param {ja.ICallbackHandler} [fn] (description)
         * @returns {ja.IAnimator} (description)
         */
        reverse(fn?: ja.ICallbackHandler): ja.IAnimator;
        /**
         * (description)
         *
         * @param {ja.ICallbackHandler} [fn] (description)
         * @returns {ja.IAnimator} (description)
         */
        cancel(fn?: ja.ICallbackHandler): ja.IAnimator;
        private _tick();
        private _triggerFinish();
        private _triggerCancel();
        private _triggerPause();
        private _reset();
    }
}
declare module "just-animate/JustAnimate" {
    /**
     * (description)
     *
     * @export
     * @class JustAnimate
     * @implements {ja.IAnimationManager}
     */
    export class JustAnimate implements ja.IAnimationManager {
        private _registry;
        private _timings;
        /**
         * (description)
         *
         * @static
         * @param {ja.IAnimationOptions[]} animations (description)
         */
        static inject(animations: ja.IAnimationOptions[]): void;
        /**
         * Creates an instance of JustAnimate.
         */
        constructor();
        /**
         * (description)
         *
         * @param {(string | ja.IIndexed<ja.IKeyframe>)} keyframesOrName (description)
         * @param {ja.ElementSource} el (description)
         * @param {ja.IAnimationEffectTiming} [timings] (description)
         * @returns {ja.IAnimator} (description)
         */
        animate(keyframesOrName: string | ja.IIndexed<ja.IKeyframe>, el: ja.ElementSource, timings?: ja.IAnimationEffectTiming): ja.IAnimator;
        /**
         * (description)
         *
         * @param {ja.ISequenceOptions} options (description)
         * @returns {ja.IAnimator} (description)
         */
        animateSequence(options: ja.ISequenceOptions): ja.IAnimator;
        /**
         * (description)
         *
         * @param {ja.ITimelineOptions} options (description)
         * @returns {ja.IAnimator} (description)
         */
        animateTimeline(options: ja.ITimelineOptions): ja.IAnimator;
        /**
         * (description)
         *
         * @param {string} name (description)
         * @returns {ja.IKeyframeOptions} (description)
         */
        findAnimation(name: string): ja.IKeyframeOptions;
        /**
         * (description)
         *
         * @param {ja.IAnimationOptions} animationOptions (description)
         * @returns {ja.IAnimationManager} (description)
         */
        register(animationOptions: ja.IAnimationOptions): ja.IAnimationManager;
    }
}
declare module "just-animate/animations/bounce" {
    export const bounce: ja.IAnimationOptions;
}
declare module "just-animate/animations/bounceIn" {
    export const bounceIn: ja.IAnimationOptions;
}
declare module "just-animate/animations/bounceInDown" {
    export const bounceInDown: ja.IAnimationOptions;
}
declare module "just-animate/animations/bounceInLeft" {
    export const bounceInLeft: {
        'keyframes': {
            'offset': number;
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/bounceInRight" {
    export const bounceInRight: {
        'keyframes': ({
            'offset': number;
            'opacity': number;
            'transform': string;
        } | {
            'offset': number;
            'transform': string;
        })[];
        'timings': {
            'duration': number;
            'fill': string;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/bounceInUp" {
    export const bounceInUp: {
        'keyframes': {
            'offset': number;
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/bounceOut" {
    export const bounceOut: {
        'keyframes': ({
            'offset': number;
            'opacity': number;
            'transform': string;
        } | {
            'offset': number;
            'transform': string;
        })[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/bounceOutDown" {
    export const bounceOutDown: {
        'keyframes': ({
            'offset': number;
            'opacity': number;
            'transform': string;
        } | {
            'offset': number;
            'transform': string;
        })[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/bounceOutLeft" {
    export const bounceOutLeft: {
        'keyframes': {
            'offset': number;
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/bounceOutRight" {
    export const bounceOutRight: {
        'keyframes': {
            'offset': number;
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/bounceOutUp" {
    export const bounceOutUp: {
        'keyframes': {
            'offset': number;
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeIn" {
    export const fadeIn: {
        'keyframes': {
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeInDown" {
    export const fadeInDown: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeInDownBig" {
    export const fadeInDownBig: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeInLeft" {
    export const fadeInLeft: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeInLeftBig" {
    export const fadeInLeftBig: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeInRight" {
    export const fadeInRight: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeInRightBig" {
    export const fadeInRightBig: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeInUp" {
    export const fadeInUp: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeInUpBig" {
    export const fadeInUpBig: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeOut" {
    export const fadeOut: {
        'keyframes': {
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeOutDown" {
    export const fadeOutDown: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeOutDownBig" {
    export const fadeOutDownBig: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeOutLeft" {
    export const fadeOutLeft: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeOutLeftBig" {
    export const fadeOutLeftBig: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeOutRight" {
    export const fadeOutRight: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeOutRightBig" {
    export const fadeOutRightBig: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeOutUp" {
    export const fadeOutUp: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/fadeOutUpBig" {
    export const fadeOutUpBig: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/flash" {
    export const flash: {
        'keyframes': {
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/flip" {
    export const flip: {
        'keyframes': {
            'offset': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/flipInX" {
    export const flipInX: {
        'keyframes': ({
            'offset': number;
            'transform': string;
            'easing': string;
            'opacity': number;
        } | {
            'offset': number;
            'transform': string;
            'easing': string;
        } | {
            'offset': number;
            'transform': string;
            'opacity': number;
        } | {
            'offset': number;
            'transform': string;
        })[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/flipInY" {
    export const flipInY: {
        'keyframes': ({
            'offset': number;
            'transform': string;
            'opacity': number;
        } | {
            'offset': number;
            'transform': string;
        })[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/flipOutX" {
    export const flipOutX: {
        'keyframes': {
            'offset': number;
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/flipOutY" {
    export const flipOutY: {
        'keyframes': {
            'offset': number;
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/headShake" {
    export const headShake: {
        'keyframes': {
            'offset': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/hinge" {
    export const hinge: {
        'keyframes': ({
            'transform': string;
            'transform-origin': string;
            'opacity': number;
        } | {
            'transform': string;
            'opacity': number;
        })[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/jello" {
    export const jello: {
        'keyframes': {
            'offset': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/lightSpeedIn" {
    export const lightSpeedIn: {
        'keyframes': {
            'offset': number;
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/lightSpeedOut" {
    export const lightSpeedOut: {
        'keyframes': {
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
            'fill': string;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/pulse" {
    export const pulse: {
        'keyframes': {
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/rollIn" {
    export const rollIn: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/rollOut" {
    export const rollOut: {
        'keyframes': {
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/rotateIn" {
    export const rotateIn: {
        'keyframes': {
            'transform-origin': string;
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/rotateInDownLeft" {
    export const rotateInDownLeft: {
        'keyframes': {
            'transform-origin': string;
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/rotateInDownRight" {
    export const rotateInDownRight: {
        'keyframes': {
            'transform-origin': string;
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/rotateInUpLeft" {
    export const rotateInUpLeft: {
        'keyframes': {
            'transform-origin': string;
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/rotateInUpRight" {
    export const rotateInUpRight: {
        'keyframes': {
            'transform-origin': string;
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/rotateOut" {
    export const rotateOut: {
        'keyframes': {
            'transform-origin': string;
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/rotateOutDownLeft" {
    export const rotateOutDownLeft: {
        'keyframes': {
            'transform-origin': string;
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/rotateOutDownRight" {
    export const rotateOutDownRight: {
        'keyframes': {
            'transform-origin': string;
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/rotateOutUpLeft" {
    export const rotateOutUpLeft: {
        'keyframes': {
            'transform-origin': string;
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/rotateOutUpRight" {
    export const rotateOutUpRight: {
        'keyframes': {
            'transform-origin': string;
            'transform': string;
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/rubberBand" {
    export const rubberBand: {
        'keyframes': {
            'offset': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/shake" {
    export const shake: {
        'keyframes': {
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/slideInDown" {
    export const slideInDown: {
        'keyframes': {
            'transform': string;
            'visibility': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/slideInLeft" {
    export const slideInLeft: {
        'keyframes': {
            'transform': string;
            'visibility': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/slideInRight" {
    export const slideInRight: {
        'keyframes': {
            'transform': string;
            'visibility': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/slideInUp" {
    export const slideInUp: {
        'keyframes': {
            'transform': string;
            'visibility': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/slideOutDown" {
    export const slideOutDown: {
        'keyframes': {
            'transform': string;
            'visibility': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/slideOutLeft" {
    export const slideOutLeft: {
        'keyframes': {
            'visibility': string;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/slideOutRight" {
    export const slideOutRight: {
        'keyframes': {
            'visibility': string;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/slideOutUp" {
    export const slideOutUp: {
        'keyframes': {
            'visibility': string;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/swing" {
    export const swing: {
        'keyframes': {
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/tada" {
    export const tada: {
        'keyframes': {
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/wobble" {
    export const wobble: {
        'keyframes': {
            'offset': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    };
}
declare module "just-animate/animations/zoomIn" {
    export const zoomIn: {
        'keyframes': ({
            'opacity': number;
            'transform': string;
        } | {
            'opacity': number;
        })[];
        'timings': {
            'duration': number;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/zoomInDown" {
    export const zoomInDown: {
        'keyframes': {
            'offset': number;
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/zoomInLeft" {
    export const zoomInLeft: {
        'keyframes': {
            'offset': number;
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/zoomInRight" {
    export const zoomInRight: {
        'keyframes': {
            'offset': number;
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/zoomInUp" {
    export const zoomInUp: {
        'keyframes': {
            'offset': number;
            'opacity': number;
            'transform': string;
        }[];
        'timings': {
            'duration': number;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/zoomOut" {
    export const zoomOut: {
        'keyframes': ({
            'opacity': number;
            'transform': string;
            'transform-origin': string;
        } | {
            'opacity': number;
            'transform': string;
        })[];
        'timings': {
            'duration': number;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/zoomOutDown" {
    export const zoomOutDown: {
        'keyframes': {
            'offset': number;
            'opacity': number;
            'transform': string;
            'transform-origin': string;
        }[];
        'timings': {
            'duration': number;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/zoomOutLeft" {
    export const zoomOutLeft: {
        'keyframes': ({
            'offset': number;
            'opacity': number;
            'transform': string;
            'transform-origin': string;
        } | {
            'offset': number;
            'opacity': number;
            'transform': string;
        })[];
        'timings': {
            'duration': number;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/zoomOutRight" {
    export const zoomOutRight: {
        'keyframes': ({
            'offset': number;
            'opacity': number;
            'transform': string;
            'transform-origin': string;
        } | {
            'offset': number;
            'opacity': number;
            'transform': string;
        })[];
        'timings': {
            'duration': number;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations/zoomOutUp" {
    export const zoomOutUp: {
        'keyframes': ({
            'offset': number;
            'opacity': number;
            'transform': string;
            'transform-origin': string;
        } | {
            'offset': number;
            'opacity': number;
            'transform': string;
        })[];
        'timings': {
            'duration': number;
            'easing': string;
        };
        'name': string;
    };
}
declare module "just-animate/animations" {
    import { bounce } from "just-animate/animations/bounce";
    import { bounceIn } from "just-animate/animations/bounceIn";
    import { bounceInDown } from "just-animate/animations/bounceInDown";
    import { bounceInLeft } from "just-animate/animations/bounceInLeft";
    import { bounceInRight } from "just-animate/animations/bounceInRight";
    import { bounceInUp } from "just-animate/animations/bounceInUp";
    import { bounceOut } from "just-animate/animations/bounceOut";
    import { bounceOutDown } from "just-animate/animations/bounceOutDown";
    import { bounceOutLeft } from "just-animate/animations/bounceOutLeft";
    import { bounceOutRight } from "just-animate/animations/bounceOutRight";
    import { bounceOutUp } from "just-animate/animations/bounceOutUp";
    import { fadeIn } from "just-animate/animations/fadeIn";
    import { fadeInDown } from "just-animate/animations/fadeInDown";
    import { fadeInDownBig } from "just-animate/animations/fadeInDownBig";
    import { fadeInLeft } from "just-animate/animations/fadeInLeft";
    import { fadeInLeftBig } from "just-animate/animations/fadeInLeftBig";
    import { fadeInRight } from "just-animate/animations/fadeInRight";
    import { fadeInRightBig } from "just-animate/animations/fadeInRightBig";
    import { fadeInUp } from "just-animate/animations/fadeInUp";
    import { fadeInUpBig } from "just-animate/animations/fadeInUpBig";
    import { fadeOut } from "just-animate/animations/fadeOut";
    import { fadeOutDown } from "just-animate/animations/fadeOutDown";
    import { fadeOutDownBig } from "just-animate/animations/fadeOutDownBig";
    import { fadeOutLeft } from "just-animate/animations/fadeOutLeft";
    import { fadeOutLeftBig } from "just-animate/animations/fadeOutLeftBig";
    import { fadeOutRight } from "just-animate/animations/fadeOutRight";
    import { fadeOutRightBig } from "just-animate/animations/fadeOutRightBig";
    import { fadeOutUp } from "just-animate/animations/fadeOutUp";
    import { fadeOutUpBig } from "just-animate/animations/fadeOutUpBig";
    import { flash } from "just-animate/animations/flash";
    import { flip } from "just-animate/animations/flip";
    import { flipInX } from "just-animate/animations/flipInX";
    import { flipInY } from "just-animate/animations/flipInY";
    import { flipOutX } from "just-animate/animations/flipOutX";
    import { flipOutY } from "just-animate/animations/flipOutY";
    import { headShake } from "just-animate/animations/headShake";
    import { hinge } from "just-animate/animations/hinge";
    import { jello } from "just-animate/animations/jello";
    import { lightSpeedIn } from "just-animate/animations/lightSpeedIn";
    import { lightSpeedOut } from "just-animate/animations/lightSpeedOut";
    import { pulse } from "just-animate/animations/pulse";
    import { rollIn } from "just-animate/animations/rollIn";
    import { rollOut } from "just-animate/animations/rollOut";
    import { rotateIn } from "just-animate/animations/rotateIn";
    import { rotateInDownLeft } from "just-animate/animations/rotateInDownLeft";
    import { rotateInDownRight } from "just-animate/animations/rotateInDownRight";
    import { rotateInUpLeft } from "just-animate/animations/rotateInUpLeft";
    import { rotateInUpRight } from "just-animate/animations/rotateInUpRight";
    import { rotateOut } from "just-animate/animations/rotateOut";
    import { rotateOutDownLeft } from "just-animate/animations/rotateOutDownLeft";
    import { rotateOutDownRight } from "just-animate/animations/rotateOutDownRight";
    import { rotateOutUpLeft } from "just-animate/animations/rotateOutUpLeft";
    import { rotateOutUpRight } from "just-animate/animations/rotateOutUpRight";
    import { rubberBand } from "just-animate/animations/rubberBand";
    import { shake } from "just-animate/animations/shake";
    import { slideInDown } from "just-animate/animations/slideInDown";
    import { slideInLeft } from "just-animate/animations/slideInLeft";
    import { slideInRight } from "just-animate/animations/slideInRight";
    import { slideInUp } from "just-animate/animations/slideInUp";
    import { slideOutDown } from "just-animate/animations/slideOutDown";
    import { slideOutLeft } from "just-animate/animations/slideOutLeft";
    import { slideOutRight } from "just-animate/animations/slideOutRight";
    import { slideOutUp } from "just-animate/animations/slideOutUp";
    import { swing } from "just-animate/animations/swing";
    import { tada } from "just-animate/animations/tada";
    import { wobble } from "just-animate/animations/wobble";
    import { zoomIn } from "just-animate/animations/zoomIn";
    import { zoomInDown } from "just-animate/animations/zoomInDown";
    import { zoomInLeft } from "just-animate/animations/zoomInLeft";
    import { zoomInRight } from "just-animate/animations/zoomInRight";
    import { zoomInUp } from "just-animate/animations/zoomInUp";
    import { zoomOut } from "just-animate/animations/zoomOut";
    import { zoomOutDown } from "just-animate/animations/zoomOutDown";
    import { zoomOutLeft } from "just-animate/animations/zoomOutLeft";
    import { zoomOutRight } from "just-animate/animations/zoomOutRight";
    import { zoomOutUp } from "just-animate/animations/zoomOutUp";
    export const ANIMATE_CSS: (ja.IAnimationOptions | {
        'keyframes': {
            'opacity': number;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    } | {
        'keyframes': {
            'transform': string;
        }[];
        'timings': {
            'duration': number;
        };
        'name': string;
    })[];
    export { bounce };
    export { bounceIn };
    export { bounceInDown };
    export { bounceInLeft };
    export { bounceInRight };
    export { bounceInUp };
    export { bounceOut };
    export { bounceOutDown };
    export { bounceOutLeft };
    export { bounceOutRight };
    export { bounceOutUp };
    export { fadeIn };
    export { fadeInDown };
    export { fadeInDownBig };
    export { fadeInLeft };
    export { fadeInLeftBig };
    export { fadeInRight };
    export { fadeInRightBig };
    export { fadeInUp };
    export { fadeInUpBig };
    export { fadeOut };
    export { fadeOutDown };
    export { fadeOutDownBig };
    export { fadeOutLeft };
    export { fadeOutLeftBig };
    export { fadeOutRight };
    export { fadeOutRightBig };
    export { fadeOutUp };
    export { fadeOutUpBig };
    export { flash };
    export { flip };
    export { flipInX };
    export { flipInY };
    export { flipOutX };
    export { flipOutY };
    export { headShake };
    export { hinge };
    export { jello };
    export { lightSpeedIn };
    export { lightSpeedOut };
    export { pulse };
    export { rollIn };
    export { rollOut };
    export { rotateIn };
    export { rotateInDownLeft };
    export { rotateInDownRight };
    export { rotateInUpLeft };
    export { rotateInUpRight };
    export { rotateOut };
    export { rotateOutDownLeft };
    export { rotateOutDownRight };
    export { rotateOutUpLeft };
    export { rotateOutUpRight };
    export { rubberBand };
    export { shake };
    export { slideInDown };
    export { slideInLeft };
    export { slideInRight };
    export { slideInUp };
    export { slideOutDown };
    export { slideOutLeft };
    export { slideOutRight };
    export { slideOutUp };
    export { swing };
    export { tada };
    export { wobble };
    export { zoomIn };
    export { zoomInDown };
    export { zoomInLeft };
    export { zoomInRight };
    export { zoomInUp };
    export { zoomOut };
    export { zoomOutDown };
    export { zoomOutLeft };
    export { zoomOutRight };
    export { zoomOutUp };
}
declare module "just-animate/index" {
    import * as animations from "just-animate/animations";
    export { animations };
    export { JustAnimate } from "just-animate/JustAnimate";
}

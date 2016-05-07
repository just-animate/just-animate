declare module "app/helpers" {
    export function noop(): void;
    export function clamp(val: number, min: number, max: number): number;
    export function head<T>(indexed: ja.IIndexed<T>): T;
    export function tail<T>(indexed: ja.IIndexed<T>): T;
    export function isArray(a: any): boolean;
    export function isFunction(a: any): boolean;
    export function isNumber(a: any): boolean;
    export function isString(a: any): boolean;
    export function toArray<T>(indexed: ja.IIndexed<T>): T[];
    export function each<T1>(items: ja.IIndexed<T1>, fn: ja.IConsumer<T1>): void;
    export function max<T1>(items: ja.IIndexed<T1>, propertyName: string): any;
    export function map<T1, T2>(items: ja.IIndexed<T1>, fn: ja.IMapper<T1, T2>): T2[];
    export function extend(target: any, ...sources: any[]): any;
    export function multiapply(targets: ja.IIndexed<any>, fnName: string, args: ja.IIndexed<any>, cb?: ja.ICallbackHandler): any[];
}
declare module "easings" {
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
declare module "app/ElementAnimator" {
    export class ElementAnimator implements ja.IAnimator {
        duration: number;
        onfinish: ja.IConsumer<ja.IAnimator>;
        oncancel: ja.IConsumer<ja.IAnimator>;
        private _animators;
        playbackRate: number;
        constructor(manager: ja.IAnimationManager, keyframesOrName: string | ja.IIndexed<ja.IKeyframe>, el: ja.ElementSource, timings?: ja.IAnimationEffectTiming);
        currentTime: number;
        finish(fn?: ja.ICallbackHandler): ja.IAnimator;
        play(fn?: ja.ICallbackHandler): ja.IAnimator;
        pause(fn?: ja.ICallbackHandler): ja.IAnimator;
        reverse(fn?: ja.ICallbackHandler): ja.IAnimator;
        cancel(fn?: ja.ICallbackHandler): ja.IAnimator;
    }
}
declare module "app/SequenceAnimator" {
    export class SequenceAnimator implements ja.IAnimator {
        playbackRate: number;
        onfinish: ja.IConsumer<ja.IAnimator>;
        oncancel: ja.IConsumer<ja.IAnimator>;
        private _currentIndex;
        private _errorCallback;
        private _manager;
        private _steps;
        currentTime: number;
        duration: number;
        constructor(manager: ja.IAnimationManager, options: ja.ISequenceOptions);
        finish(fn?: ja.ICallbackHandler): ja.IAnimator;
        play(fn?: ja.ICallbackHandler): ja.IAnimator;
        pause(fn?: ja.ICallbackHandler): ja.IAnimator;
        reverse(fn?: ja.ICallbackHandler): ja.IAnimator;
        cancel(fn?: ja.ICallbackHandler): ja.IAnimator;
        private _isInEffect();
        private _getAnimator();
        private _playNextStep(evt);
        private _playThisStep();
    }
}
declare module "app/TimelineAnimator" {
    export class TimelineAnimator implements ja.IAnimator {
        currentTime: number;
        duration: number;
        playbackRate: number;
        onfinish: ja.IConsumer<ja.IAnimator>;
        oncancel: ja.IConsumer<ja.IAnimator>;
        private _events;
        private _isInEffect;
        private _isFinished;
        private _isCanceled;
        private _isPaused;
        private _lastTick;
        private _manager;
        constructor(manager: ja.IAnimationManager, options: ja.ITimelineOptions);
        finish(fn?: ja.ICallbackHandler): ja.IAnimator;
        play(fn?: ja.ICallbackHandler): ja.IAnimator;
        pause(fn?: ja.ICallbackHandler): ja.IAnimator;
        reverse(fn?: ja.ICallbackHandler): ja.IAnimator;
        cancel(fn?: ja.ICallbackHandler): ja.IAnimator;
        private _tick();
        private _triggerFinish();
        private _triggerCancel();
        private _triggerPause();
        private _reset();
    }
}
declare module "AnimationManager" {
    export class AnimationManager implements ja.IAnimationManager {
        private _registry;
        private _timings;
        static inject(animations: ja.IAnimationOptions[]): void;
        constructor();
        animate(keyframesOrName: string | ja.IIndexed<ja.IKeyframe>, el: ja.ElementSource, timings?: ja.IAnimationEffectTiming): ja.IAnimator;
        animateSequence(options: ja.ISequenceOptions): ja.IAnimator;
        animateTimeline(options: ja.ITimelineOptions): ja.IAnimator;
        findAnimation(name: string): ja.IKeyframeOptions;
        register(animationOptions: ja.IAnimationOptions): ja.IAnimationManager;
    }
}
declare module "animations/bounce" {
    export const bounce: {
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
declare module "animations/bounceIn" {
    export const bounceIn: {
        'keyframes': ({
            'opacity': number;
            'transform': string;
        } | {
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
declare module "animations/bounceInDown" {
    export const bounceInDown: {
        'keyframes': {
            'offset': number;
            'easing': string;
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
declare module "animations/bounceInLeft" {
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
declare module "animations/bounceInRight" {
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
declare module "animations/bounceInUp" {
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
declare module "animations/bounceOut" {
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
declare module "animations/bounceOutDown" {
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
declare module "animations/bounceOutLeft" {
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
declare module "animations/bounceOutRight" {
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
declare module "animations/bounceOutUp" {
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
declare module "animations/fadeIn" {
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
declare module "animations/fadeInDown" {
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
declare module "animations/fadeInDownBig" {
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
declare module "animations/fadeInLeft" {
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
declare module "animations/fadeInLeftBig" {
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
declare module "animations/fadeInRight" {
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
declare module "animations/fadeInRightBig" {
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
declare module "animations/fadeInUp" {
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
declare module "animations/fadeInUpBig" {
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
declare module "animations/fadeOut" {
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
declare module "animations/fadeOutDown" {
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
declare module "animations/fadeOutDownBig" {
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
declare module "animations/fadeOutLeft" {
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
declare module "animations/fadeOutLeftBig" {
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
declare module "animations/fadeOutRight" {
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
declare module "animations/fadeOutRightBig" {
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
declare module "animations/fadeOutUp" {
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
declare module "animations/fadeOutUpBig" {
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
declare module "animations/flash" {
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
declare module "animations/flip" {
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
declare module "animations/flipInX" {
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
declare module "animations/flipInY" {
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
declare module "animations/flipOutX" {
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
declare module "animations/flipOutY" {
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
declare module "animations/headShake" {
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
declare module "animations/hinge" {
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
declare module "animations/jello" {
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
declare module "animations/lightSpeedIn" {
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
declare module "animations/lightSpeedOut" {
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
declare module "animations/pulse" {
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
declare module "animations/rollIn" {
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
declare module "animations/rollOut" {
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
declare module "animations/rotateIn" {
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
declare module "animations/rotateInDownLeft" {
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
declare module "animations/rotateInDownRight" {
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
declare module "animations/rotateInUpLeft" {
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
declare module "animations/rotateInUpRight" {
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
declare module "animations/rotateOut" {
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
declare module "animations/rotateOutDownLeft" {
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
declare module "animations/rotateOutDownRight" {
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
declare module "animations/rotateOutUpLeft" {
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
declare module "animations/rotateOutUpRight" {
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
declare module "animations/rubberBand" {
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
declare module "animations/shake" {
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
declare module "animations/slideInDown" {
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
declare module "animations/slideInLeft" {
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
declare module "animations/slideInRight" {
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
declare module "animations/slideInUp" {
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
declare module "animations/slideOutDown" {
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
declare module "animations/slideOutLeft" {
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
declare module "animations/slideOutRight" {
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
declare module "animations/slideOutUp" {
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
declare module "animations/swing" {
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
declare module "animations/tada" {
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
declare module "animations/wobble" {
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
declare module "animations/zoomIn" {
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
declare module "animations/zoomInDown" {
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
declare module "animations/zoomInLeft" {
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
declare module "animations/zoomInRight" {
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
declare module "animations/zoomInUp" {
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
declare module "animations/zoomOut" {
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
declare module "animations/zoomOutDown" {
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
declare module "animations/zoomOutLeft" {
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
declare module "animations/zoomOutRight" {
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
declare module "animations/zoomOutUp" {
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
declare module "animations" {
    import { bounce } from "animations/bounce";
    import { bounceIn } from "animations/bounceIn";
    import { bounceInDown } from "animations/bounceInDown";
    import { bounceInLeft } from "animations/bounceInLeft";
    import { bounceInRight } from "animations/bounceInRight";
    import { bounceInUp } from "animations/bounceInUp";
    import { bounceOut } from "animations/bounceOut";
    import { bounceOutDown } from "animations/bounceOutDown";
    import { bounceOutLeft } from "animations/bounceOutLeft";
    import { bounceOutRight } from "animations/bounceOutRight";
    import { bounceOutUp } from "animations/bounceOutUp";
    import { fadeIn } from "animations/fadeIn";
    import { fadeInDown } from "animations/fadeInDown";
    import { fadeInDownBig } from "animations/fadeInDownBig";
    import { fadeInLeft } from "animations/fadeInLeft";
    import { fadeInLeftBig } from "animations/fadeInLeftBig";
    import { fadeInRight } from "animations/fadeInRight";
    import { fadeInRightBig } from "animations/fadeInRightBig";
    import { fadeInUp } from "animations/fadeInUp";
    import { fadeInUpBig } from "animations/fadeInUpBig";
    import { fadeOut } from "animations/fadeOut";
    import { fadeOutDown } from "animations/fadeOutDown";
    import { fadeOutDownBig } from "animations/fadeOutDownBig";
    import { fadeOutLeft } from "animations/fadeOutLeft";
    import { fadeOutLeftBig } from "animations/fadeOutLeftBig";
    import { fadeOutRight } from "animations/fadeOutRight";
    import { fadeOutRightBig } from "animations/fadeOutRightBig";
    import { fadeOutUp } from "animations/fadeOutUp";
    import { fadeOutUpBig } from "animations/fadeOutUpBig";
    import { flash } from "animations/flash";
    import { flip } from "animations/flip";
    import { flipInX } from "animations/flipInX";
    import { flipInY } from "animations/flipInY";
    import { flipOutX } from "animations/flipOutX";
    import { flipOutY } from "animations/flipOutY";
    import { headShake } from "animations/headShake";
    import { hinge } from "animations/hinge";
    import { jello } from "animations/jello";
    import { lightSpeedIn } from "animations/lightSpeedIn";
    import { lightSpeedOut } from "animations/lightSpeedOut";
    import { pulse } from "animations/pulse";
    import { rollIn } from "animations/rollIn";
    import { rollOut } from "animations/rollOut";
    import { rotateIn } from "animations/rotateIn";
    import { rotateInDownLeft } from "animations/rotateInDownLeft";
    import { rotateInDownRight } from "animations/rotateInDownRight";
    import { rotateInUpLeft } from "animations/rotateInUpLeft";
    import { rotateInUpRight } from "animations/rotateInUpRight";
    import { rotateOut } from "animations/rotateOut";
    import { rotateOutDownLeft } from "animations/rotateOutDownLeft";
    import { rotateOutDownRight } from "animations/rotateOutDownRight";
    import { rotateOutUpLeft } from "animations/rotateOutUpLeft";
    import { rotateOutUpRight } from "animations/rotateOutUpRight";
    import { rubberBand } from "animations/rubberBand";
    import { shake } from "animations/shake";
    import { slideInDown } from "animations/slideInDown";
    import { slideInLeft } from "animations/slideInLeft";
    import { slideInRight } from "animations/slideInRight";
    import { slideInUp } from "animations/slideInUp";
    import { slideOutDown } from "animations/slideOutDown";
    import { slideOutLeft } from "animations/slideOutLeft";
    import { slideOutRight } from "animations/slideOutRight";
    import { slideOutUp } from "animations/slideOutUp";
    import { swing } from "animations/swing";
    import { tada } from "animations/tada";
    import { wobble } from "animations/wobble";
    import { zoomIn } from "animations/zoomIn";
    import { zoomInDown } from "animations/zoomInDown";
    import { zoomInLeft } from "animations/zoomInLeft";
    import { zoomInRight } from "animations/zoomInRight";
    import { zoomInUp } from "animations/zoomInUp";
    import { zoomOut } from "animations/zoomOut";
    import { zoomOutDown } from "animations/zoomOutDown";
    import { zoomOutLeft } from "animations/zoomOutLeft";
    import { zoomOutRight } from "animations/zoomOutRight";
    import { zoomOutUp } from "animations/zoomOutUp";
    export const ANIMATE_CSS: ({
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
declare module "index" {
    import * as easings from "easings";
    import * as animations from "animations";
    export { animations, easings };
    export { AnimationManager } from "AnimationManager";
}

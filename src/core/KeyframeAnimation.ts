import {Dispatcher, IDispatcher} from './Dispatcher';
import {isDefined} from '../helpers/type';
import {nothing} from '../helpers/resources';
import {unwrap} from '../helpers/objects';

import {
    animate,
    finish,
    cancel,
    play,
    pause,
    reverse
} from '../helpers/resources';

export function KeyframeAnimation(target: Element, keyframes: ja.ICssKeyframeOptions[], options: ja.IAnimationOptions): ja.IAnimationController {
    const self = this instanceof KeyframeAnimation ? this : Object.create(KeyframeAnimation.prototype); 
    
    const duration = options.to - options.from;

    self._iterationStart = unwrap(options.iterationStart) || 0;
    self._iterations = unwrap(options.iterations) || 1;
    self._duration = duration;
    self._startTime = options.from || 0;
    self._endTime = options.to;
    self._totalDuration = (self._iterations || 1) * duration;

    const dispatcher = Dispatcher();
    self._dispatcher = dispatcher;

    const animator = target[animate](keyframes, {
        delay: unwrap(options.delay) || undefined,
        direction: unwrap(options.direction),
        duration: duration,
        easing: options.easing || 'linear',
        fill: options.fill || 'none',
        iterationStart: self._iterationStart,
        iterations: self._iterations
    });

    // immediately cancel to prevent effects until play is called    
    animator.cancel();    
    animator['onfinish'] = () => dispatcher.trigger(finish);
    self._animator = animator;
    return self;
}
 
KeyframeAnimation.prototype = {
    _dispatcher: nothing as IDispatcher,
    _duration: nothing as number,
    _endTime: nothing as number,
    _iterationStart: nothing as number,    
    _iterations: nothing as number,
    _startTime: nothing as number,
    _totalDuration: nothing as number,
    currentTime(value?: number): number | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._animator.currentTime;
        }
        self._animator.currentTime = value;
        return self;
    },
    playbackRate(value?: number): number | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._animator.playbackRate;
        }
        self._animator.playbackRate = value;
        return self;
    },

    playState(): ja.AnimationPlaybackState {
        return this._animator.playState;
    },
    iterationStart(): number {
        return this._iterationStart;
    },
    iterations(): number {
        return this._iterations;
    },
    totalDuration(): number {
        return this._totalDuration;
    },
    duration(): number {
        return this._duration;
    },
    endTime(): number {
        return this._endTime;
    },
    startTime(): number {
        return this._startTime;
    },
    off(eventName: string, listener: Function): ja.IAnimator {
        this._dispatcher.off(eventName, listener);
        return this;
    },
    on(eventName: string, listener: Function): ja.IAnimator {
        this._dispatcher.on(eventName, listener);
        return this;
    },
    cancel(): ja.IAnimator {
        const self = this;
        self._animator.cancel();
        self._dispatcher.trigger(cancel);
        return self;
    },
    reverse(): ja.IAnimator {
        const self = this;
        self._animator.reverse();
        self._dispatcher.trigger(reverse);
        return self;
    },
    pause(): ja.IAnimator {
        const self = this;
        self._animator.pause();
        self._dispatcher.trigger(pause);
        return self;
    },
    play(): ja.IAnimator {
        const self = this;
        self._animator.play();
        self._dispatcher.trigger(play);
        return self;
    },
    finish(): ja.IAnimator {
        const self = this;
        self._animator.finish();
        return self;
    }
};

declare module waapi {
    export interface IAnimation {
        id: string;
        startTime: number;
        currentTime: number;
        playState: 'idle' | 'pending' | 'running' | 'paused' | 'finished';
        playbackRate: number;
        onfinish: Function;
        oncancel: Function;

        cancel(): void;
        finish(): void;
        play(): void;
        pause(): void;
        reverse(): void;

        addEventListener(eventName: string, listener: Function): void;
        removeEventListener(eventName: string, listener: Function): void;
    }

    export interface IAnimationEffectTiming {
        direction?: string;
        delay?: number;
        duration?: number;
        easing?: string;
        endDelay?: number;
        fill?: string;
        iterationStart?: number;
        iterations?: number;
    }
}

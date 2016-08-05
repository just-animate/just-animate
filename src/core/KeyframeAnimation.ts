import {createDispatcher, IDispatcher} from './Dispatcher';
import {isDefined} from '../helpers/type';

import {
    animate,
    finish,
    cancel,
    play,
    pause,
    reverse
} from '../helpers/resources';

const keyframeAnimationPrototype = {
    _dispatcher: undefined as IDispatcher,
    _duration: undefined as number,
    _endTime: undefined as number,
    _iterationStart: undefined as number,    
    _iterations: undefined as number,
    _startTime: undefined as number,
    _totalDuration: undefined as number,
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
export function createKeyframeAnimation(target: Element, keyframes: ja.IKeyframeOptions[], timings: ja.IAnimationEffectTiming): ja.IAnimator {
    const self = Object.create(keyframeAnimationPrototype) as ja.IAnimator|any; 
    const dispatcher = createDispatcher();
    const animator = target[animate](keyframes, timings);

    animator.pause();
    animator['onfinish'] = () => dispatcher.trigger(finish);

    self._iterationStart = timings.iterationStart || 0;
    self._iterations = timings.iterations || 1;
    self._duration = timings.duration;
    self._startTime = timings.delay || 0;
    self._endTime = (timings.endDelay || 0) + timings.duration;
    self._totalDuration = (timings.delay || 0) + ((timings.iterations || 1) * timings.duration) + (timings.endDelay || 0);

    self._dispatcher = dispatcher;
    self._animator = animator;
    return self;
}

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
}
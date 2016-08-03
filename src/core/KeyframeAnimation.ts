import {createDispatcher, IDispatcher} from './Dispatcher';
import {isDefined} from '../helpers/type';

export class KeyframeAnimation implements ja.IAnimator {
    private _animator: waapi.IAnimation;
    private _dispatcher: IDispatcher;
    private _iterationStart: number;
    private _iterations: number;
    private _totalDuration: number;
    private _duration: number;
    private _startTime: number;
    private _endTime: number;
    
    public currentTime(): number;    
    public currentTime(value: number): ja.IAnimator;    
    public currentTime(value?: number): number | ja.IAnimator {
        const self = this; 
        if (!isDefined(value)) {
            return self._animator.currentTime;
        }
        self._animator.currentTime = value;
        return self;
    }

    public playbackRate(): number;    
    public playbackRate(value: number): ja.IAnimator;       
    public playbackRate(value?: number): number | ja.IAnimator {
        const self = this; 
        if (!isDefined(value)) {
            return self._animator.playbackRate;
        }
        self._animator.playbackRate = value;    
        return self;
    }

    public playState(): ja.AnimationPlaybackState {
        return this._animator.playState;
    }
    public iterationStart(): number {
        return this._iterationStart;
    }
    public iterations(): number {
        return this._iterations;
    }
    public totalDuration(): number {
        return this._totalDuration;
    }
    public duration(): number {
        return this._duration;
    }
    public endTime(): number {
        return this._endTime;
    }
    public startTime(): number {
        return this._startTime;
    }

    constructor(target: Element, keyframes: ja.IKeyframeOptions[], timings: ja.IAnimationEffectTiming) {
        const self = this; 
        const dispatcher = createDispatcher();
        const animator = target['animate'](keyframes, timings);

        animator.pause();
        animator['onfinish'] = () => dispatcher.trigger('finish');

        self._iterationStart = timings.iterationStart || 0;
        self._iterations = timings.iterations || 1;
        self._duration = timings.duration;
        self._startTime = timings.delay || 0;
        self._endTime = (timings.endDelay || 0) + timings.duration;
        self._totalDuration = (timings.delay || 0) + ((timings.iterations || 1) * timings.duration) + (timings.endDelay || 0);

        self._dispatcher = dispatcher;
        self._animator = animator;
    }

    public off(eventName: string, listener: Function): ja.IAnimator  {
        this._dispatcher.off(eventName, listener);
        return this;
    }

    public on(eventName: string, listener: Function): ja.IAnimator  {
        this._dispatcher.on(eventName, listener);
        return this;
    }

    public cancel(): ja.IAnimator  {
        const self = this; 
        self._animator.cancel();
        self._dispatcher.trigger('cancel');
        return self;
    }

    public reverse(): ja.IAnimator  {
        const self = this; 
        self._animator.reverse();
        self._dispatcher.trigger('reverse');
        return self;
    }

    public pause(): ja.IAnimator { 
        const self = this; 
        self._animator.pause();
        self._dispatcher.trigger('pause');
        return self;
    }

    public play(): ja.IAnimator  { 
        const self = this; 
        self._animator.play();
        self._dispatcher.trigger('play');
        return self;
    }

    public finish(): ja.IAnimator  { 
        const self = this; 
        self._animator.finish();
        return self;
    }
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
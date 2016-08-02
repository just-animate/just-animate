import {Dispatcher} from './Dispatcher';

export class KeyframeAnimation implements ja.IAnimator {
    private _animator: waapi.IAnimation;
    private _dispatcher: Dispatcher;
    private _iterationStart: number;
    private _iterations: number;
    private _totalDuration: number;
    private _duration: number;
    private _startTime: number;
    private _endTime: number;
    
    public get currentTime(): number {
        return this._animator.currentTime;
    }
    public set currentTime(value: number) {
        this._animator.currentTime = value;
    }
	
    public get playbackRate(): number {
        return this._animator.playbackRate;
    }
    public set playbackRate(value: number) {
        this._animator.playbackRate = value;
    }

    public get playState(): ja.AnimationPlaybackState {
        return this._animator.playState;
    }
    public set playState(value: ja.AnimationPlaybackState) {
        this._animator.playState = value;   
    }

    public get iterationStart(): number {
        return this._iterationStart;
    }
    public set iterationStart(value: number) {
        this._iterationStart = value;
    }

    public get iterations(): number {
        return this._iterations;
    }
    public set iterations(value: number) {
        this._iterations = value;
    }

    public get totalDuration(): number {
        return this._totalDuration;
    }
    public set totalDuration(value: number) {
        this._totalDuration = value;
    }

    public get duration(): number {
        return this._duration;
    }
    public set duration(value: number) {
        this._duration = value;
    }

    public get endTime(): number {
        return this._endTime;
    }
    public set endTime(value: number) {
        this._endTime = value;
    }

    public get startTime(): number {
        return this._startTime;
    }
    public set startTime(value: number) {
        this._startTime = value;
    }

    constructor(target: Element, keyframes: ja.IKeyframeOptions[], timings: ja.IAnimationEffectTiming) {
        const dispatcher = new Dispatcher();
        const animator = target['animate'](keyframes, timings);

        animator.pause();
        animator['onfinish'] = () => dispatcher.trigger('finish');

        this._iterationStart = timings.iterationStart || 0;
        this._iterations = timings.iterations || 1;
        this._duration = timings.duration;
        this._startTime = timings.delay || 0;
        this._endTime = (timings.endDelay || 0) + timings.duration;
        this._totalDuration = (timings.delay || 0) + ((timings.iterations || 1) * timings.duration) + (timings.endDelay || 0);

        this._dispatcher = dispatcher;
        this._animator = animator;
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
        this._animator.cancel();
        this._dispatcher.trigger('cancel');
        return this;
    }

    public reverse(): ja.IAnimator  {
        this._animator.reverse();
        this._dispatcher.trigger('reverse');
        return this;
    }

    public pause(): ja.IAnimator { 
        this._animator.pause();
        this._dispatcher.trigger('pause');
        return this;
    }

    public play(): ja.IAnimator  { 
        this._animator.play();
        this._dispatcher.trigger('play');
        return this;
    }

    public finish(): ja.IAnimator  { 
        this._animator.finish();
        return this;
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
import {animate, finish, cancel, play, pause, reverse} from '../../common/resources';
import {Dispatcher, IDispatcher} from '../core/Dispatcher';

export class KeyframeAnimator implements ja.IAnimationController {
    private _dispatcher: IDispatcher;
    private _animator: waapi.IAnimation;
    private _totalTime: number;

    constructor(target: Element, keyframes: waapi.IKeyframe[], timings: waapi.IEffectTiming) {
        const delay = timings.delay || 0;
        const endDelay = timings.endDelay || 0;
        const iterations = timings.iterations || 1;
        const duration = timings.duration || 0;
        const dispatcher = Dispatcher();

        const self = this;        
        self._totalTime = delay + ((iterations || 1) * duration) + endDelay;
        self._dispatcher = dispatcher;

        const animator = target[animate](keyframes, timings);

        // immediately cancel to prevent effects until play is called    
        animator.cancel();
        animator.onfinish = () => dispatcher.trigger(finish);
        self._animator = animator;
    }

    public totalDuration(): number {
        return this._totalTime;
    }

    public seek(value: number): void {
        const self = this;
        self._animator.currentTime = value;
    }
    public playbackRate(value: number): void {
        const self = this;
        self._animator.playbackRate = value;
    }

    public playState(): ja.AnimationPlaybackState {
        return this._animator.playState;
    }
    public off(eventName: string, listener: Function): void {
        this._dispatcher.off(eventName, listener);
    }
    public on(eventName: string, listener: Function): void {
        this._dispatcher.on(eventName, listener);
    }
    public cancel(): void {
        const self = this;
        self._animator.cancel();
        self._dispatcher.trigger(cancel);
    }
    public reverse(): void {
        const self = this;
        self._animator.reverse();
        self._dispatcher.trigger(reverse);
    }
    public pause(): void {
        const self = this;
        self._animator.pause();
        self._dispatcher.trigger(pause);
    }
    public play(): void {
        const self = this;
        self._animator.play();
        self._dispatcher.trigger(play);
    }
    public finish(): void {
        const self = this;
        self._animator.finish();
    }
}


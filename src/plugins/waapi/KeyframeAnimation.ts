import {animate, finish, cancel, play, pause, reverse, nil} from '../../common/resources';

export class KeyframeAnimator implements ja.IAnimationController {
    private _animator: waapi.IAnimation;
    private _totalTime: number;

    constructor(target: Element, keyframes: waapi.IKeyframe[], timings: waapi.IEffectTiming) {
        const delay = timings.delay || 0;
        const endDelay = timings.endDelay || 0;
        const iterations = timings.iterations || 1;
        const duration = timings.duration || 0;

        const self = this;        
        self._totalTime = delay + ((iterations || 1) * duration) + endDelay;

        const animator = target[animate](keyframes, timings);

        // immediately cancel to prevent effects until play is called    
        animator.cancel();
        self._animator = animator;
    }

    public totalDuration(): number {
        return this._totalTime;
    }

    public seek(value: number): void {
        this._animator.currentTime = value;
    }
    public playbackRate(value: number): void {
        this._animator.playbackRate = value;
    }
    public reverse(): void {
        this._animator.playbackRate *= -1;
    }

    public playState(): ja.AnimationPlaybackState;
    public playState(value: ja.AnimationPlaybackState): void;
    public playState(value?: ja.AnimationPlaybackState): ja.AnimationPlaybackState | void {
        const self = this;
        const animator = self._animator;
        const playState = animator.playState;
        if (value === nil) {
            return playState;
        }
        if (value === 'finished') {
            animator.finish();
            return;
        }
        if (value === 'idle') {
            animator.cancel();
            return;
        }
        if (value === 'paused') {
            animator.pause();
            return;
        }
        if (value === 'running') {
            animator.play();
            return;
        }
    }

    public onupdate(context: ja.IAnimationTimeContext): void { /* do nothing */ }
}


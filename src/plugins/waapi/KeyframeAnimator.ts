import {finished, paused, running, idle, nil} from '../../common/resources';

export class KeyframeAnimator implements ja.IAnimationController {
    public totalDuration: number;
    public onupdate: { (context: ja.IAnimationTimeContext): void };
    
    private _init: ja.Resolver<waapi.IAnimation>;
    private _animator: waapi.IAnimation;

    constructor(init: ja.Resolver<waapi.IAnimation>) {
        this._init = init;
    }

    public seek(value: number): void {
        this._ensureInit();
        if (this._animator.currentTime !== value) {
            this._animator.currentTime = value;
        }
    }
    public playbackRate(value: number): void {
        this._ensureInit();
        if (this._animator.playbackRate !== value) {
            this._animator.playbackRate = value;
        }
    }
    public reverse(): void {
        this._ensureInit();
        this._animator.playbackRate *= -1;
    }

    public playState(): ja.AnimationPlaybackState;
    public playState(value: ja.AnimationPlaybackState): void;
    public playState(value?: ja.AnimationPlaybackState): ja.AnimationPlaybackState | void {
        const self = this;
        self._ensureInit();        

        const animator = self._animator;
        const playState = animator.playState;
        if (value === nil) {
            return playState;
        }
        if (value === finished) {
            animator.finish();
        } else if (value === idle) {
            animator.cancel();
        } else if (value === paused) {
            animator.pause();
        } else if (value === running) {
            animator.play();
        }
    }

    private _ensureInit(): void {
        if (this._init) {
            this._animator = (this._init as ja.IResolver<waapi.IAnimation>)();
            this._init = nil;
        }
    }
}


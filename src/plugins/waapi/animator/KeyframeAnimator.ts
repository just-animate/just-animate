import * as waapi from '../waapi';

/**
 * Implements the IAnimationController interface for the Web Animation API
 * 
 * @export
 * @class KeyframeAnimator
 * @implements {ja.IAnimationController}
 */
export class KeyframeAnimator implements ja.IAnimationController {
    public totalDuration: number;
    private _initialized: boolean | undefined;
    private _init: { (): waapi.Animation; } | undefined;
    private _animator: waapi.Animation;

    constructor(init: { (): waapi.Animation; }) {
        this._init = init;
        this._initialized = undefined;
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
    public restart(): void {
        const animator = this._animator;
        animator.cancel();
        animator.play();
    }
    public playState(): ja.AnimationPlaybackState;
    public playState(value: ja.AnimationPlaybackState): void;
    public playState(value?: ja.AnimationPlaybackState): ja.AnimationPlaybackState | undefined {
        const self = this;
        self._ensureInit();

        const animator = self._animator;
        const playState = !animator || self._initialized === false ? 'fatal' : animator.playState;
        if (value === undefined) {
            return playState as ja.AnimationPlaybackState;
        }

        if (playState === value) {
            /* do nothing */
        } else if (playState === 'fatal') {
            animator.cancel();
        } else if (value === 'finished') {
            animator.finish();
        } else if (value === 'idle') {
            animator.cancel();
        } else if (value === 'paused') {
            animator.pause();
        } else if (value === 'running') {
            animator.play();
        }
        return undefined;
    }

    private _ensureInit(): void {
        const self = this;
        const init = self._init as { (): waapi.Animation; };
        if (init) {
            self._init = undefined;
            self._initialized = false;
            self._animator = init();
            self._initialized = true;
        }
    }
}
